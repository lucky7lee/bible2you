# Keep JavaScriptInterface bridge methods
-keepclassmembers class io.github.lucky7lee.daybible2u.MainActivity$DayBibleBridge {
    @android.webkit.JavascriptInterface <methods>;
}
