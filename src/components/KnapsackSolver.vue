<script setup lang="ts">
import _ from "lodash";
import { ref, watchEffect } from 'vue';
import { solveKnapsack } from './solver';
import { Input, Solution } from './types';

const INITIAL_TEXT = `
    6, 10, 12
    1, 2, 3
    4
`.replace(/ |^\n/g, '');

const text = ref(INITIAL_TEXT);
const input = ref<Input>();
const error = ref<string>();
const solution = ref<Solution>();

watchEffect(() => {
  try {
    const nonEmptyLines = text.value.split("\n").map(ln => ln.trim()).filter(ln => ln.length);
    if (nonEmptyLines.length !== 3)
      throw new Error("input should have 3 lines:\nprofit, weight, and weightLimit");

    const [profitText, weightText, weightLimitText] = nonEmptyLines;
    const profitList = profitText.split(',').map(v => parseInt(v)).filter(v => !isNaN(v));
    const weightList = weightText.split(',').map(v => parseInt(v)).filter(v => !isNaN(v));
    const weightLimit = parseInt(weightLimitText);
    if (profitList.length !== weightList.length)
      throw new Error("profit and weight should have the same length");

    const items = profitList.map((profit, i) => ({ profit, weight: weightList[i] }));
    input.value = { items, weightLimit };

    error.value = undefined;
  } catch (e) {
    const ee = e as Error;
    console.error(ee);
    error.value = ee.message;
  }
});

watchEffect(() => {
  try {
    if (!input.value) throw new Error("input doesn't have value");

    const { items, weightLimit } = input.value;
    solution.value = solveKnapsack(items, weightLimit);
  } catch (e) {
    const ee = e as Error;
    console.error(ee);
    error.value = ee.message;
  }
});

const highlighting = ref(new Map<string, string>());
const makeKey = (i: number, j: number) => `${i} ${j}`;
const trace = (iItem: number, weightLimit: number) => {
  highlighting.value.set(makeKey(iItem, weightLimit), "bg-green-100");
  const cell = solution.value!.table[iItem][weightLimit];
  if (cell.from) {
    trace(...cell.from);
  }
};

</script>

<template>
  <div class="flex flex-col items-start h-screen">
    <div class="relative w-full h-40 p-2">
      <textarea v-model="text" class="h-full w-full border rounded-lg resize-none p-1 overflow-auto bg-transparent">
      </textarea>
      <div class="absolute h-full inset-0 -z-10 flex justify-center items-center">
        <div class="text-6xl text-gray-200 font-bold">Input</div>
      </div>
    </div>

    <div class="flex-1 w-full flex justify-center items-center border-t overflow-auto">
      <div v-if="error" class="p-2 border rounded-lg border-red-200 relative">
        <pre class="text-red-600">{{ error }}</pre>
      </div>
      <div v-else-if="solution && input" class="p-2 border rounded-lg">
        <table class="table-fixed gap-1">
          <thead class=" border-b">
            <tr class="">
              <th class="w-16">profit</th>
              <th class="w-16">weight</th>
              <th class="w-8" v-for="iCol in _.range(solution.nCol)">{{ iCol }}</th>
            </tr>
          </thead>
          <tbody class=" text-gray-600">
            <tr v-for="(row, iItem) in solution.table">
              <th>{{ input.items[iItem - 1]?.profit ?? '-' }}</th>
              <th>{{ input.items[iItem - 1]?.weight ?? '-' }}</th>
              <td v-for="(cell, weightLimit) in row" :class="highlighting.get(makeKey(iItem, weightLimit))"
                @mouseenter="trace(iItem, weightLimit)" @mouseleave="highlighting.clear()">
                {{ cell.maxProfit }}
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<style scoped>
th {
  @apply text-gray-950 font-bold
}

td {
  @apply text-center
}
</style>
