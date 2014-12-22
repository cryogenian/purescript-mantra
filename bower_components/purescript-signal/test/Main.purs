module Test.Main where

import Data.Tuple(Tuple(..))
import Signal
import Signal.Time
import Test.Signal
import Test.Unit

main = runTest do

  test "subscribe to constant must yield once" do
    expect 1 (constant "lol") ["lol"]

  test "merge two constants yields second constant" do
    expect 1 (constant "foo" <> constant "bar") ["bar"]

  test "map function over signal" do
    expect 5 (tick 1 1 [1, 2, 3] ~> \x -> x * 2) [2, 4, 6]

  test "sampleOn samples values from sig2 when sig1 changes" do
    expect 150 (sampleOn (every 40) $ tick 10 20 [1, 2, 3, 4, 5, 6]) [1, 3, 5, 6]

  test "distinct only yields when value is /= previous" do
    expect 10 (distinct $ tick 1 1 [1, 1, 2, 2, 1, 3, 3]) [1, 2, 1, 3]

  test "zip with Tuple yields a tuple of both signals" do
    expect 10 (zip Tuple (tick 2 4 [1, 2, 3]) (tick 4 4 [1, 2, 3]))
      [Tuple 1 1, Tuple 2 1, Tuple 2 2, Tuple 3 2, Tuple 3 3]

  test "sum up values with foldp" do
    expect 10 (foldp (+) 0 $ tick 1 1 [1, 2, 3, 4, 5]) [1, 3, 6, 10, 15]
