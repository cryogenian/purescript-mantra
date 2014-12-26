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

type Dial a b e = a -> b -> Eff e (Component a b)

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
       Eff (reactive :: Reactive|e) (Component inp out)
set state c@(Component comp) = do 
  writeRVar comp.input state
  return c

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
        (inp -> out ->  Eff (reactive :: Reactive|e) Unit) -> 
        Component inp out ->
        Eff (reactive :: Reactive|e) (Component inp out)
init handler component@(Component comp) = do
  out <- readRVar comp.output
  subscribe comp.input (\inp -> handler inp out)
  return component


defineComponent :: forall inp out e.
                   (inp -> out -> Eff (reactive :: Reactive|e) Unit) -> 
                   inp ->
                   out ->
                   Eff (reactive :: Reactive|e) (Component inp out) 
defineComponent initFn input output = 
  mkComponent input output >>= init initFn 


child = defineComponent $ \input output ->
  whisper input


-- parent = defineComponent $ \input output ->
--  for_ input $ \i -> child i 
--  render child
--  renderP input


main = do
  whisper "foobar"
--  test <- parent [0] 0
--  windowize "foo" test
--  test2 <- parent [0] 0
--  windowize "bar" test2
  
--  whisper test
--  whisper test2
--  runSignal $ (every 1000) ~> \_ -> update (\(n:ns) -> (n+1):n:ns) test
  
  

