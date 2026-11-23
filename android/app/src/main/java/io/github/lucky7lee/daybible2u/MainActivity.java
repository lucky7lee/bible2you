package io.github.lucky7lee.daybible2u;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

public class MainActivity extends Activity {

    private static final String APP_START_URL = "https://appassets.androidplatform.net/assets/index.html";
    private static final int REQ_CAMERA_PERMISSION = 1001;
    private static final int REQ_FILE_CHOOSER = 1002;
    private static final long INTERSTITIAL_COOLDOWN_MS = 60_000L; // 전면 광고 최소 60초 간격

    // =========================================================================
    // Google AdMob Ad Unit IDs
    // 현재: Google 공식 테스트 광고 ID (비공개 테스트 중 자가 클릭 정지 방지용)
    // 정식 출시 전 AdMob 콘솔에서 데이바이블2U 배너/전면 광고 단위 ID 발급 후 교체하세요.
    // =========================================================================
    private static final String ADMOB_BANNER_UNIT_ID = "ca-app-pub-3940256099942544/6300978111";
    private static final String ADMOB_INTERSTITIAL_UNIT_ID = "ca-app-pub-3940256099942544/1033173712";

    private WebView webView;
    private FrameLayout bannerContainer;
    private AdView bannerAdView;
    private InterstitialAd interstitialAd;
    private boolean isLoadingInterstitial = false;
    private long lastInterstitialShownAt = 0L;
    private long lastBackPressTime = 0L;

    // 카메라 런타임 권한 및 사진 파일 선택 콜백 보관
    private PermissionRequest pendingWebPermissionRequest = null;
    private ValueCallback<Uri[]> fileUploadCallback = null;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            requestWindowFeature(Window.FEATURE_NO_TITLE);
        } catch (Exception ignored) {
        }
        super.onCreate(savedInstanceState);

        try {
            Window window = getWindow();
            if (window != null) {
                window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                window.setStatusBarColor(Color.parseColor("#070B19"));
                window.setNavigationBarColor(Color.parseColor("#070B19"));
                window.getDecorView().setBackgroundColor(Color.parseColor("#070B19"));
            }
        } catch (Exception ignored) {
        }

        LinearLayout rootLayout = new LinearLayout(this);
        rootLayout.setOrientation(LinearLayout.VERTICAL);
        rootLayout.setBackgroundColor(Color.parseColor("#070B19"));
        rootLayout.setFitsSystemWindows(true);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        // 1. 상단 WebView (남은 공간 전체 차지)
        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#070B19"));
        webView.setHorizontalScrollBarEnabled(false);
        webView.setVerticalScrollBarEnabled(false);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        // 두 손가락 확대(Pinch-to-Zoom) 지원 (화면 줌 버튼은 숨김)
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setTextZoom(100);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // JS ↔ Android 네이티브 광고 브릿지 등록
        webView.addJavascriptInterface(new DayBibleBridge(), "DayBibleAndroid");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (request == null || request.getUrl() == null) {
                    return null;
                }
                Uri uri = request.getUrl();
                if ("appassets.androidplatform.net".equals(uri.getHost())) {
                    String path = uri.getPath();
                    if (path != null && path.startsWith("/assets/")) {
                        String assetPath = path.substring("/assets/".length());
                        if (assetPath.isEmpty()) {
                            assetPath = "index.html";
                        }
                        try {
                            InputStream is = getAssets().open(assetPath);
                            String mimeType = guessMimeType(assetPath);
                            String encoding = mimeType.startsWith("text/") || mimeType.contains("javascript") || mimeType.contains("json") || mimeType.contains("xml")
                                    ? "UTF-8" : null;
                            return new WebResourceResponse(mimeType, encoding, is);
                        } catch (IOException ignored) {
                        }
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request == null || request.getUrl() == null) return false;
                Uri uri = request.getUrl();
                String host = uri.getHost();
                if ("appassets.androidplatform.net".equals(host)) {
                    return false;
                }
                // 외부 링크(Google AI Studio, 개인정보처리방침 등)는 시스템 브라우저로 열기
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    startActivity(intent);
                    return true;
                } catch (Exception ignored) {
                    return false;
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            // 카메라 얼굴 스캔(getUserMedia) 권한 요청 처리
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> {
                    String[] resources = request.getResources();
                    boolean needsCamera = false;
                    for (String res : resources) {
                        if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(res)) {
                            needsCamera = true;
                            break;
                        }
                    }
                    if (!needsCamera) {
                        request.grant(resources);
                        return;
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
                            checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                        pendingWebPermissionRequest = request;
                        requestPermissions(new String[]{Manifest.permission.CAMERA}, REQ_CAMERA_PERMISSION);
                    } else {
                        request.grant(resources);
                    }
                });
            }

            // 사진 파일 업로드(<input type="file">) 처리
            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams
            ) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = filePathCallback;

                try {
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("image/*");
                    startActivityForResult(Intent.createChooser(intent, "Select Photo"), REQ_FILE_CHOOSER);
                    return true;
                } catch (Exception e) {
                    fileUploadCallback = null;
                    return false;
                }
            }
        });

        LinearLayout.LayoutParams webParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1.0f
        );
        rootLayout.addView(webView, webParams);

        // 2. 하단 Google AdMob 고정 배너 컨테이너
        bannerContainer = new FrameLayout(this);
        bannerContainer.setBackgroundColor(Color.parseColor("#070B19"));
        LinearLayout.LayoutParams bannerParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rootLayout.addView(bannerContainer, bannerParams);

        setContentView(rootLayout);

        // 웹 앱 로드
        webView.loadUrl(APP_START_URL);

        // Google AdMob SDK 초기화 및 배너·전면 광고 로드
        initAdMob();
    }

    private void initAdMob() {
        try {
            MobileAds.initialize(this, initializationStatus -> runOnUiThread(() -> {
                loadBannerAd();
                loadInterstitialAd();
            }));
        } catch (Exception ignored) {
        }
    }

    private AdSize getAdaptiveBannerSize() {
        DisplayMetrics metrics = getResources().getDisplayMetrics();
        int adWidth = (int) (metrics.widthPixels / metrics.density);
        if (adWidth <= 0) adWidth = 320;
        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(this, adWidth);
    }

    private void loadBannerAd() {
        if (bannerContainer == null) return;
        try {
            bannerContainer.removeAllViews();
            bannerAdView = new AdView(this);
            bannerAdView.setAdUnitId(ADMOB_BANNER_UNIT_ID);
            bannerAdView.setAdSize(getAdaptiveBannerSize());

            FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    Gravity.CENTER
            );
            bannerContainer.addView(bannerAdView, lp);
            bannerAdView.loadAd(new AdRequest.Builder().build());
        } catch (Exception ignored) {
        }
    }

    private void loadInterstitialAd() {
        if (isLoadingInterstitial || interstitialAd != null) return;
        isLoadingInterstitial = true;
        try {
            AdRequest adRequest = new AdRequest.Builder().build();
            InterstitialAd.load(
                    this,
                    ADMOB_INTERSTITIAL_UNIT_ID,
                    adRequest,
                    new InterstitialAdLoadCallback() {
                        @Override
                        public void onAdLoaded(@NonNull InterstitialAd ad) {
                            interstitialAd = ad;
                            isLoadingInterstitial = false;
                        }

                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                            interstitialAd = null;
                            isLoadingInterstitial = false;
                        }
                    }
            );
        } catch (Exception ignored) {
            isLoadingInterstitial = false;
        }
    }

    private void showInterstitialIfReady() {
        runOnUiThread(() -> {
            long now = System.currentTimeMillis();
            if (now - lastInterstitialShownAt < INTERSTITIAL_COOLDOWN_MS) {
                return;
            }
            if (interstitialAd != null) {
                lastInterstitialShownAt = now;
                interstitialAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                    @Override
                    public void onAdDismissedFullScreenContent() {
                        interstitialAd = null;
                        loadInterstitialAd();
                    }

                    @Override
                    public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                        interstitialAd = null;
                        loadInterstitialAd();
                    }
                });
                interstitialAd.show(MainActivity.this);
            } else {
                loadInterstitialAd();
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_CAMERA_PERMISSION && pendingWebPermissionRequest != null) {
            PermissionRequest req = pendingWebPermissionRequest;
            pendingWebPermissionRequest = null;
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                req.grant(req.getResources());
            } else {
                req.deny();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_FILE_CHOOSER && fileUploadCallback != null) {
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                Uri uri = data.getData();
                if (uri != null) {
                    results = new Uri[]{uri};
                }
            }
            fileUploadCallback.onReceiveValue(results);
            fileUploadCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        long now = System.currentTimeMillis();
        if (now - lastBackPressTime < 2000) {
            super.onBackPressed();
        } else {
            lastBackPressTime = now;
            boolean isKo = Locale.getDefault().getLanguage().startsWith("ko");
            String msg = isKo
                    ? "한 번 더 누르면 앱이 종료됩니다."
                    : "Press back again to exit.";
            Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onPause() {
        if (bannerAdView != null) bannerAdView.pause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (bannerAdView != null) bannerAdView.resume();
    }

    @Override
    protected void onDestroy() {
        if (bannerAdView != null) bannerAdView.destroy();
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    private String guessMimeType(String path) {
        String lower = path.toLowerCase(Locale.US);
        if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
        if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".ico")) return "image/x-icon";
        if (lower.endsWith(".wasm")) return "application/wasm";
        if (lower.endsWith(".txt")) return "text/plain";
        return "application/octet-stream";
    }

    private class DayBibleBridge {
        @JavascriptInterface
        public boolean isAndroidApp() {
            return true;
        }

        @JavascriptInterface
        public void showInterstitial() {
            showInterstitialIfReady();
        }
    }
}
