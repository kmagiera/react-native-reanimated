package com.swmansion.reanimated;

import android.graphics.Matrix;
import android.graphics.RectF;
import android.view.View;
import android.view.ViewParent;

import com.facebook.react.uimanager.RootViewUtil;
import com.facebook.react.views.scroll.ReactScrollView;

public class NativeMethodsHelper {

  public static int[] measure(View view) {
    View rootView = (View) RootViewUtil.getRootView(view);
    int buffer[] = new int [4];
    computeBoundingBox(rootView, buffer);
    int rootX = buffer[0];
    int rootY = buffer[1];
    computeBoundingBox(view, buffer);
    buffer[0] -= rootX;
    buffer[1] -= rootY;

    int result[] = new int [6];
    result[0] = result[1] = 0;
    for (int i = 2; i < 6; ++i) result[i] = buffer[i-2];

    return result;
  }

  public static void scrollTo(View view, double x, double y, boolean animated) {
    ReactScrollView scrollView = (ReactScrollView)view;
    if (animated) {
      scrollView.smoothScrollTo((int)x, (int)y);
    } else {
      scrollView.scrollTo((int)x, (int)y);
    }
  }

  private static void computeBoundingBox(View view, int[] outputBuffer) {
    RectF boundingBox = new RectF();
    boundingBox.set(0, 0, view.getWidth(), view.getHeight());
    mapRectFromViewToWindowCoords(view, boundingBox);

    outputBuffer[0] = Math.round(boundingBox.left);
    outputBuffer[1] = Math.round(boundingBox.top);
    outputBuffer[2] = Math.round(boundingBox.right - boundingBox.left);
    outputBuffer[3] = Math.round(boundingBox.bottom - boundingBox.top);
  }

  private static void mapRectFromViewToWindowCoords(View view, RectF rect) {
    Matrix matrix = view.getMatrix();
    if (!matrix.isIdentity()) {
      matrix.mapRect(rect);
    }

    rect.offset(view.getLeft(), view.getTop());

    ViewParent parent = view.getParent();
    while (parent instanceof View) {
      View parentView = (View) parent;

      rect.offset(-parentView.getScrollX(), -parentView.getScrollY());

      matrix = parentView.getMatrix();
      if (!matrix.isIdentity()) {
        matrix.mapRect(rect);
      }

      rect.offset(parentView.getLeft(), parentView.getTop());

      parent = parentView.getParent();
    }
  }

}
