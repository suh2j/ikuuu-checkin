package com.ikuuucheckin;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ikuuu-checkin-app";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a {@link
   * DefaultReactActivityDelegate} which allows you to enable New Architecture with a single
   * boolean flag {@link BuildConfig#IS_NEW_ARCHITECTURE_ENABLED}.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, you need to enable the Fabric Renderer
        // for your app. As this is a demo app with limited profiling capabilities, we are
        // keeping it disabled, but you should enable it by default on newer apps.
        // - Fabricated apps will have better performance out of the box.
        // - Fabric is necessary for the upcoming Concurrent features.
        DefaultNewArchitectureEntryPoint.getFabricDelegate());
  }
}
