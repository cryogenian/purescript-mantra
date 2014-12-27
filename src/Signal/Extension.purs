module Signal.Extension where

import Signal
import Data.Function


infixl 4 ~~>
(~~>) :: forall a b f.
         (Applicative f) =>
         Signal (f a) -> (a -> b) -> Signal (f b)
(~~>) sfb ab = 
  sfb ~> liftA1 ab 

foreign import bindSigFn """
function bindSigFn(constant, sig, fun) {
  var out = constant(fun(sig.get).get());
  sig.subscribe(function(a) {
    fun(a).subscribe(function(b) {
      out.set(b);
    });
  });
  return out;
}
""" :: forall a b. Fn3 (b -> Signal b) (Signal a) (a -> Signal b) (Signal b)

instance signalBind :: Bind Signal where
  (>>=) ma fun = runFn3 bindSigFn constant ma fun


instance signalMonad :: Monad Signal

  
  
  
