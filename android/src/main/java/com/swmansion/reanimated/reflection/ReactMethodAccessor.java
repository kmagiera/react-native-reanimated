package com.swmansion.reanimated.reflection;

import android.util.Log;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContext;
import com.swmansion.reanimated.NodesManager;
import com.swmansion.reanimated.nodes.Node;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;

import static com.swmansion.reanimated.Utils.concat;

class ReactMethodAccessor extends NativeModuleAccessor implements ReanimatedAccessor {
    private NativeModule mCallee;
    private MethodAccessor mMethod;

    ReactMethodAccessor(ReactContext context, String moduleName, String methodName) {
        super(context);
        setCaller(moduleName, methodName);
    }

    private void setCaller(String moduleName, String methodName) {
        NativeModule module = getNativeModule(moduleName);
        setCaller(module, methodName);
    }

    private void setCaller(NativeModule module, String methodName){
        mCallee = module;
        mMethod = getReactMethod(module, methodName);
    }

    public void call(int[] params, NodesManager nodesManager){
        invoke(cast(params, nodesManager));
    }

    private void invoke(Object[] params) {
        try {
            mMethod.getMethod().invoke(mCallee, params);
        } catch (Throwable err) {
            String errorMessage;
            if(err instanceof InvocationTargetException){
                errorMessage = err.getCause().getMessage();
            } else {
                errorMessage = err.getMessage();
            }

            throw new JSApplicationIllegalArgumentException(
                    "Reanimated invoke error:\n" +
                            String.format("module: %s,\n", mCallee.getName()) +
                            String.format("method: %s,\n", mMethod.getName()) +
                            String.format("\nparams: %s\n", concat(params, "\n")) +
                            "Details: " + errorMessage,
                    err
            );
        }
    }

    private Object[] cast(int[] params, NodesManager nodesManager) {
        Object[] out = new Object[params.length];
        Node n;
        Object value;
        Class<?>[] paramTypes = mMethod.getParamTypes();
        Class<?> paramType;
        int k = 0;

        try {
            for (k = 0; k < params.length; k++) {
                paramType = paramTypes[k];
                n = nodesManager.findNodeById(params[k], Node.class);
                value = n.value();

                if (value != null && ReflectionUtils.isNumber(value)) {
                    out[k] = ReflectionUtils.fromDouble(((Double) value), paramType);
                } else {
                    out[k] = paramType.cast(value);
                }
            }
        } catch (Throwable err){
            String outOfBoundsMessage = "";
            String[] inputTypes = new String[params.length];
            ArrayList<String> parts = new ArrayList<>();
            for (int i = 0; i < params.length; i++) {
                n = nodesManager.findNodeById(params[i], Node.class);
                parts.clear();
                parts.add(paramTypes[i].getSimpleName());
                parts.add(n.getClass().getSimpleName());
                parts.add(n.value().toString());
                inputTypes[i] = concat(parts.toArray());
            }
            String typeDetails = "Args: (expected, got, value)\n" + concat(inputTypes, "\n");
            if(err instanceof ArrayIndexOutOfBoundsException){
                outOfBoundsMessage = "Expected " + paramTypes.length + " parameters, got " + params.length;
            }

            throw new JSApplicationIllegalArgumentException(
                    "Parameter mismatch when calling reanimated invoke, index=" + k + ".\n" +
                            mCallee.getName() + "." + mMethod +"\n" +
                            outOfBoundsMessage + ".\n" +
                            typeDetails + ".\n",
                    err
            );
        }

        return out;
    }

    @Override
    public void connectToView(int viewTag) {
        //  noop
        //  this is used for invoking a view manager command only
    }

    @Override
    public void disconnectFromView(int viewTag) {
        //  noop
        //  this is used for invoking a view manager command only
    }
}