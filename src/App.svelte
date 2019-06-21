<div class="centered">
  <main>
    <h1 class="title">8Queen</h1>
    <GameArea {count} {judge} {field} on:updateChild={updateChild}></GameArea>
    <span>Queenの数：{count}</span><button on:click={reset}>はじめから</button><br>
    <span>{judge}</span>
  </main>
</div>


<script lang="ts">
  import * as _util from 'smicle-util'
  import GameArea from './components/GameArea.svelte'

  let count = 0
  let judge = ''
  let field: number[] = _util.range(64).fill(0)

  const updateChild = (e: any) => {
    count = e.detail.count
    judge = e.detail.judge
    field = e.detail.field
  }

  const reset = () => {
    count = 0
    judge = ''
    _util.range(64).forEach(i => field[i] = 0)
  }
</script>


<style>
  @import url(http://fonts.googleapis.com/earlyaccess/notosansjp.css);

  html {
    font-family: 'Noto Sans JP', sans-serif;
  }

  span {
    position: relative;
    left: -50%;
    z-index: -2;
  }

  button {
    position: relative;
    z-index: 1;
    margin-top: 10px;
  }

  .centered {
    min-width: 500px;
    position: relative;
    overflow: hidden;
  }

  .centered main {
    position: relative;
    left: 50%;
    float: left;
  }

  .title {
    position: relative;
    left: -14%;
  }
</style>
