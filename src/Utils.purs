module Utils where

import Control.Monad.Eff

foreign import log """
function log(a) {
  console.log(a);
  return a;
}
""" :: forall a. a -> a


foreign import trace """
function trace(a) {
  return function() {
    console.log(a);
    return a;
  };
}
""" :: forall a e. a -> Eff e a

whisper a = do
  trace a
  return unit
