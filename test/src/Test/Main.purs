module Test.Main where

import Prelude
import Control.Monad.Eff (Eff())
import Control.Monad.Eff.Console (log)
import Data.Mantra
import Utils.Log
import Control.Monad.State.Class (MonadState)
import Control.Monad.Aff
import Control.Monad.Aff.Class (MonadAff)
import Control.Monad.Eff.Class (MonadEff, liftEff)
import Data.Exists
import Data.Tuple
import DOM.Node.Types

foreign import data Html :: * -> *
type HTML = Exists Html

import Control.Monad.Free.Trans
import Unsafe.Coerce (unsafeCoerce)


foreign import data Exists2 :: (* -> * -> *) -> *
runExists2 :: forall f r. (forall a b. f a b -> r) -> Exists2 f -> r
runExists2 fn ex = fn $ unsafeCoerce ex

mkExists2 :: forall f a b. f a b -> Exists2 f
mkExists2 = unsafeCoerce


data MantraF m s o s' o'
  = Modify (s -> s) o
  | Get (s -> o)
--  | Child (Mantra m s' o') s' (((o' -> Mantra m s o) -> Mantra m s Unit) -> o)
  | Child (Mantra m s' o') s' (o' -> Mantra m s Unit) o

newtype MantraC m s o = MantraC (Exists2 (MantraF m s o))
runMantraC (MantraC c) = c


type Mantra m s o = FreeT (MantraC m s) m o

instance functorMantraC :: Functor (MantraC m s) where
  map f (MantraC c) =
    MantraC
    $ unsafeCoerce
    $ (\a -> case a of
          Modify fn o -> Modify fn $ f o
          Get fn -> Get $ f <<< fn
          Child child state handler o -> Child child state handler $ f o)
    $ unsafeCoerce c

child :: forall m s s' o' e. (Monad m) => Mantra m s' o' -> s' -> (o' -> Mantra m s Unit) -> Mantra m s Unit
child comp state handler = liftFreeT $ unsafeCoerce $ Child comp state handler unit

modify :: forall m s e. (Monad m) => (s -> s) -> Mantra m s Unit
modify fn = liftFreeT $ unsafeCoerce $ Modify fn unit

put :: forall m s. (Monad m) => s -> Mantra m s Unit
put s = modify $ const s

get :: forall m s e. (Monad m) => Mantra m s s
get = liftFreeT $ unsafeCoerce $ Get id

import Utils.Log

tst :: forall e. Mantra (Eff e) Int String
tst = do
  get >>= spyF
  spyF "TROLOLO"
  put 1
  get >>= spyF
  spyF "OLOLO"
  put 14
  res <- get
  pure $ show $ res * 12

foreign import undefined :: forall a. a

import Control.Monad.Eff.Ref

readMantra :: forall m o s e. s -> Mantra (Eff (ref :: REF|e)) s o -> Eff (ref :: REF|e)  o
readMantra state mantra = do
  ref <- newRef state
  runFreeT (unsafeCoerce >>> interp ref) mantra

interp :: forall s o s' o' e. Ref s -> MantraF (Eff (ref :: REF|e)) s (Mantra (Eff (ref :: REF|e)) s o) s' o' -> Eff (ref :: REF|e) (Mantra (Eff (ref :: REF|e)) s o)
interp ref (Modify fn next) = do
  spyF "========="
  spyF "modifying: "
  spyF "========="
  liftEff $ modifyRef ref fn
  pure $ unsafeCoerce next
interp ref (Get k) = do
  s <- liftEff $ readRef ref
  spyF "========="
  spyF "getting"
  spyF s
  spyF "========="
  pure $ unsafeCoerce $ k s
interp ref (Child child s handler next) = do
  spyF "==========="
  spyF "child"
  spyF "==========="
  pure $ unsafeCoerce next

main :: Eff _ Unit
main = do
  spyF tst
  a <- readMantra 12 tst
  spyF a
  pure unit
