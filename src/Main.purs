module Main where

import Control.Monad.Eff

import Control.Reactive
import Signal
import Signal.Time

import qualified Data.StrMap as M


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


foreign import data Event :: *

foreign import nothing """
var nothing = null;
""" :: Event

foreign import data Om :: !
foreign import data Mani :: !

newtype Component s e = Component {
  state :: RVar s,
  set :: s -> Eff (reactive :: Reactive|e) Unit,
  get :: Eff (reactive :: Reactive|e) s,
  modify :: (s -> s) -> Eff (reactive :: Reactive|e) Unit,
  render :: s ->Eff (reactive :: Reactive|e) Unit,
  signal :: Signal Event
  }


defineComponent :: forall s e.
                   (s -> Eff (reactive :: Reactive|e) Unit) -> 
                   (s -> Eff (reactive :: Reactive|e) (Component s e))
defineComponent renderFunc =
  \state -> do 
    rState <- newRVar state
    let cfg = {
          state: rState,
          set: writeRVar rState,
          get: readRVar rState,
          modify: modifyRVar rState,
          render: renderFunc,
          signal: (every 1230) ~> \_ -> nothing
          }
        comp = Component cfg
    subscribe rState $ \state -> cfg.render state
    return comp


    
rf :: forall e. Number -> Eff e Unit
rf state = do
  trace "!!!!"
  trace state 
  trace "!!!!"
  return unit

comp2 = defineComponent rf 

main :: forall e. Eff (reactive :: Reactive, mantra :: Om |e) Unit
main = do
  c <- comp2 121
  case c of
    Component cfg -> do
      runSignal $ cfg.signal ~> \_ -> do
        trace "signaled"
        return unit
        
      runSignal $ (every 1000) ~> \_ -> do
        cfg.modify (\num -> num + 1)
        return unit
      
      return unit
