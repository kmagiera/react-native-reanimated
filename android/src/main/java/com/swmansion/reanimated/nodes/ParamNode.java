package com.swmansion.reanimated.nodes;

import com.facebook.react.bridge.ReadableMap;
import com.swmansion.reanimated.NodesManager;

import java.util.Stack;

public class ParamNode extends ValueNode {

  private Stack<Integer> mArgsStack;
  private int mPrevCallID;

  public ParamNode(int nodeID, ReadableMap config, NodesManager nodesManager) {
    super(nodeID, config, nodesManager);
    mArgsStack = new Stack<>();
  }

  @Override
  public void setValue(Object value) {
    Node node = mNodesManager.findNodeById(mArgsStack.peek(), Node.class);
    if (node != null) {
      ((ValueNode) node).setValue(value);
    }
  }

  public void beginContext(Integer ref, int prevCallID) {
    mPrevCallID = prevCallID;
    mArgsStack.push(ref);
  }


  public void endContext() {
    mArgsStack.pop();
  }


  @Override
  protected Object evaluate() {
    int callID = mUpdateContext.callID;
    mUpdateContext.callID = mPrevCallID;
    Node node = mNodesManager.findNodeById(mArgsStack.peek(), Node.class);
    Object val = node.value();
    mUpdateContext.callID = callID;
    return val;
  }
}
