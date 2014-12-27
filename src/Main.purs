module Main where

import Control.Monad.Eff
import Control.Reactive
import Data.Maybe
import Data.Tuple hiding (zip)
import Data.Foldable (foldl)
import Data.Traversable (Traversable)


import qualified Control.Monad.JQuery as J

import Data.StrMap

import Data.Function

import Signal
import Signal.Time

import Signal.Extension

import Utils

foreign import data Event :: *

type Node = {
  id :: String,
  dataset :: StrMap String,
  tagName :: String
  }

foreign import target """
function target(event) {
  var out = event.target;
  if (!out.dataset) {
    out.dataset = {};
  }
  return out;
}
""" :: Event -> Node


foreign import eventStreamFn """
function eventStreamFn(just, nothing, constant, type) {
  var out = constant(nothing);
  window.addEventListener(type, function(e) {
    out.set(just(e));
  });
  return out;
}
""" :: forall s. Fn4
       (s -> Maybe s)
       (Maybe s) 
       (s -> Signal s)
       String
       (Signal (Maybe Event))

foreign import document """
var document = window.document
""" :: Node


eventStream = runFn4 eventStreamFn Just Nothing constant
targetStream name = eventStream name ~~> target

clickTargets = targetStream "click"


combine :: forall a s t. (Traversable t) => t (a -> s -> s) -> a -> (s -> s) 
combine modifies mb =
  let applied = (\f -> f mb) <$> modifies
  in foldl (\a b -> a <<< b) id applied


modifyWhen :: forall a s. (s -> s) -> (a -> Boolean) -> a -> s -> s
modifyWhen func pred a =
  if pred a then func 
  else id





idEq :: String -> Maybe Node -> Boolean
idEq id mbEl = fromMaybe false $ do
  el <- mbEl
  return $ el.id == id


foreign import init """
function init() {
  window["jQuery"] = require("jquery");
}
""" :: forall e. Eff e Unit


render state = do
  p <- J.create "<p class='page-header text-center'/>"
  h1 <- J.create "<h1 id='h1'/>"

  let color = if state.active then "red" else "blue"
  
  J.css {color: color} h1
  J.appendText "Trololo" h1
  J.append h1 p
  return p

state :: {active :: Boolean}
state = {active: false}

toggleState :: forall o. {active :: Boolean|o} -> {active :: Boolean|o}
toggleState state =
  state{active = not state.active}

h1Clicked = clickTargets ~> modifyWhen toggleState (idEq "h1")
  
stateSig = foldp ($) state h1Clicked

main = do
  init
  J.ready $ do
    runSignal $ stateSig ~> \state -> do
      b <- J.select "#target"
      J.clear b
      a <- render state
      J.append a b
      return unit

