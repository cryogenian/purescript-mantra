module Main where

import Control.Monad.Eff
import Control.Reactive
import Data.Foldable


import Signal
import Signal.Time

import Utils

foreign import data Event :: *

newtype Componen s e = Componen {
  state :: RVar s,
  set :: s -> Eff (reactive :: Reactive|e) Unit,
  get :: Eff (reactive :: Reactive|e) s,
  modify :: (s -> s) -> Eff (reactive :: Reactive|e) Unit,
  render :: s ->Eff (reactive :: Reactive|e) Unit
  }


newtype Component input output = 
  Component {
    input :: RVar input,
    output :: RVar output
    }

mkComponent :: forall inp out e.
               inp -> out -> Eff (reactive :: Reactive|e) (Component inp out)
mkComponent input output = do
  inp <- newRVar input
  out <- newRVar output
  return $ Component{
    input: inp,
    output: out
    }
  

set :: forall inp out e.
       inp -> 
       Component inp out ->
       Eff (reactive :: Reactive|e) Unit
set state (Component comp) = do 
  writeRVar comp.input state
  return unit

update :: forall inp out e.
          (inp -> inp) ->
          Component inp out ->
          Eff (reactive :: Reactive|e) Unit 
update mutator (Component comp) = do 
  modifyRVar comp.input mutator


sub :: forall inp out e.
       (out -> Eff (reactive :: Reactive|e) Unit) -> 
       Component inp out -> 
       Eff (reactive :: Reactive|e) Subscription
sub handler (Component comp) = do 
  subscribe comp.output handler
       
init :: forall inp out e.
        (inp -> Eff (reactive :: Reactive|e) Unit) -> 
        Component inp out ->
        Eff (reactive :: Reactive|e) (Component inp out)
init handler component@(Component comp) = do
  subscribe comp.input handler
  return component


defineComponent :: forall inp out e.
                   inp ->
                   out ->
                   (inp -> Eff (reactive :: Reactive|e) Unit) -> 
                   Eff (reactive :: Reactive|e) (Component inp out) 
defineComponent input output initFn = 
  mkComponent input output >>= init initFn


renderTst :: forall e. Number -> Eff e Unit
renderTst = whisper

renderP :: forall e. [Number] -> Eff e Unit
renderP nums = do
  for_ nums renderTst
    

parent = defineComponent [0] 0 $ \input ->
  renderP input


mkTest = defineComponent 0 0 $ \input -> do
  whisper "foo"
  whisper input
  
main = do
  test <- parent
  whisper test
  runSignal $ (every 1000) ~> \_ -> update (\(n:ns) -> (n+1):n:ns) test
  
  

