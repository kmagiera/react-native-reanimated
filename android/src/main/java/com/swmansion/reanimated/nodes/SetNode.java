package com.swmansion.reanimated.nodes;

import com.facebook.react.bridge.ReadableMap;
import com.swmansion.reanimated.EvalContext;
import com.swmansion.reanimated.NodesManager;

public class SetNode extends Node<Double> {

  private int mWhatNodeID, mValueNodeID;

  public SetNode(int nodeID, ReadableMap config, NodesManager nodesManager) {
    super(nodeID, config, nodesManager);
    mWhatNodeID = config.getInt("what");
    mValueNodeID = config.getInt("value");
  }

  @Override
  protected Double evaluate(EvalContext evalContext) {
    Double newValue = mNodesManager.getNodeValue(mValueNodeID, evalContext);
    ValueNode what = mNodesManager.findNodeById(mWhatNodeID, ValueNode.class);
    what.setValue(newValue, evalContext);
    return newValue;
  }
}
