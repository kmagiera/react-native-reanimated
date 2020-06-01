//
//  WorkletsCache.cpp
//  DoubleConversion
//
//  Created by Szymon Kapala on 01/06/2020.
//

#include "WorkletsCache.h"
#include "Shareable.h"

using namespace facebook;

jsi::Value eval(jsi::Runtime &rt, const char *code) {
  return rt.global().getPropertyAsFunction(rt, "eval").call(rt, code);
}

jsi::Function function(jsi::Runtime &rt, const std::string& code) {
  return eval(rt, ("(" + code + ")").c_str()).getObject(rt).getFunction(rt);
}

std::shared_ptr<jsi::Function> WorkletsCache::getFunction(jsi::Runtime & rt, std::shared_ptr<FrozenObject> frozenObj) {
  int id = frozenObj->map["__workletID"]->numberValue;
  if (worklets.count(id) == 0) {
    jsi::Function fun = function(rt, frozenObj->map["asString"]->stringValue);
    std::shared_ptr<jsi::Function> funPtr(new jsi::Function(std::move(fun)));
    worklets[id] = funPtr;
  }
  return worklets[id];
}
