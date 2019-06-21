{#each field as f, i}
  <div class="trout" value={f} on:click={_ => troutClick(i)}></div>
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
    if (field[i] !== 0) return

    field[i] = field[i] === 0 ? 2 : field[i]

    paintTheTrout(i)
      .filter(n => field[n] === 0)
      .forEach(n => field[n] = field[n] === 0 ? 1 : field[n])

    count++
    if (field.every(n => n !== 0)) {
      if (count === 8) {
        judge = `${count}個置けたねおめでとう`
      } else {
        judge = `${count}個しか置けてないぞ`
      }
    }

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
    border: solid 1px black;
    left: -50%;
    float: left;
  }

  .trout[value='1'] {
    background-color: #33d5ac;
  }

  .trout[value='2'] {
    background-color: #274079;
  }
</style>
