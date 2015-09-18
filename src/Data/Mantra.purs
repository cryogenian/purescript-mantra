module Data.Mantra where

import Prelude
import Control.Monad.Aff (Aff())
import Control.Monad.Eff (Eff())
import Control.Monad.Aff.Class (MonadAff)
import Control.Monad.Eff.Class (MonadEff)

foreign import data Signal :: * -> *
foreign import pure_ :: forall a. a -> Signal a
foreign import map_ :: forall a b. (a -> b) -> Signal a -> Signal b
foreign import apply_ :: forall a b. Signal (a -> b) -> Signal a -> Signal b
foreign import bind_ :: forall a b. Signal a -> (a -> Signal b) -> Signal b
foreign import liftEff_ :: forall e a. Eff e a -> Signal a
foreign import liftAff_ :: forall e a. Aff e a -> Signal a


instance functorSignal :: Functor Signal where
  map = map_

instance applySignal :: Apply Signal where
  apply = apply_

instance bindSignal :: Bind Signal where
  bind = bind_

instance applicativeSignal :: Applicative Signal where
  pure = pure_

instance monadSignal :: Monad Signal

instance monadEffSignal :: MonadEff eff Signal where
  liftEff = liftEff_

instance monadAffSignal :: MonadAff eff Signal where
  liftAff = liftAff_

foreign import effSignal :: forall e. Signal Unit -> Eff e Unit
foreign import affSignal :: forall e. Signal Unit -> Aff e Unit
