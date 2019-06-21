{#each field as f, i}
  <div class="trout" number={f} on:click={_ => troutClick(i)}></div>
  {#if (i + 1) % 8 == 0}<br>{/if}
{/each}


<script lang="ts">
  import 'smicle-util'
  import * as _util from 'smicle-util'
  import {paintTheTrout} from '../ts/PaintTheTrout'
  import {createEventDispatcher} from 'svelte'
  const dispatch = createEventDispatcher()

  export let count: number
  export let judge: string
  export let field: number[]

  const troutClick = (i: number) => {
    if (field[i] === 0) {
      colorTheSquares(i)
      count++
      endConfirmation()
      updateChild()
    } else if (field[i] === 23) {
      const queen = _util.range(64).filter(n => field[n] == 23)._delete(i)
      resetBoard()
      queen.forEach(colorTheSquares)
      count--
      endConfirmation()
      updateChild()
    }
  }

  const colorTheSquares = (i: number) => {
    changeToKaoriColor(i)
    paintTheTrout(i)
      .filter(n => field[n] === 0)
      .forEach(changeToKaedeColor)
  }

  const resetBoard = () => _util.range(64).forEach(i => field[i] = 0)

  const changeToKaedeColor = (i: number) => field[i] = field[i] === 0 ? 25 : field[i]
  const changeToKaoriColor = (i: number) => field[i] = field[i] === 0 ? 23 : field[i]

  const endConfirmation = () => {
    if (field.some(n => n === 0)) {
      judge = ""
    } else if (count === 8) {
      judge = `${count}個置けたねおめでとう`
    } else {
      judge = `${count}個しか置けてないぞ`
    }
  }

  const updateChild = () => {
    dispatch('updateChild', {
      count: count,
      judge: judge,
      field: field,
    })
  }
</script>


<style>
  .trout {
    position: relative;
    width: 50px;
    height: 50px;
    left: -50%;
    float: left;
    border: solid 1px black;
  }

  .trout[number='25'] {
    /* Takagaki Kaede Color */
    background-color: #33d5ac;
  }

  .trout[number='23'] {
    /* Sakuramori Kaori Color */
    background-color: #274079;
  }
</style>
