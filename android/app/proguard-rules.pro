# Keep JavaScriptInterface bridge methods & annotations
-keepattributes JavascriptInterface, *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class io.github.lucky7lee.daybible2u.MainActivity$DayBibleBridge {
    *;
}

# Keep Google Mobile Ads (AdMob) classes safely
-keep public class com.google.android.gms.ads.** {
    public *;
}
-keep public class com.google.ads.** {
    public *;
}
-dontwarn com.google.android.gms.**
