<template>
    <HeightResize v-row="`1-250px`" v-slot="{height}">
        <Editor :model-value="output" :height="height" :lang="lang"/>
        <Card :height="height" :title="getDisplayName(lang)" padding="5px 10px">
            <Align :direction="'vertical'">
                <div v-for="item in optionDefine">
                    <template v-if="item.type === 'boolean'">
                        <Bool v-model="current.option[lang][item.name]" :label="item.description"/>
                    </template>
                    <template v-else>
                        <div style="font-size: 14px">{{ item.description }}</div>
                        <Select
                            v-if="item.type === 'select'"
                            :center="false"
                            width="100%"
                            v-model="current.option[lang][item.name]"
                            :options="item.value"
                        />
                        <Input v-else v-model="current.option[lang][item.name]"/>
                    </template>
                </div>
            </Align>
        </Card>
    </HeightResize>
</template>

<script lang="ts" setup>
import {PropType, watch} from "vue"
import Serialize from "@/helper/serialize"
import {getDisplayName} from "@/helper/code";
import {transform, Option} from "./index";
import {Option as TargetOption} from "./type";

const props = defineProps({
    modelValue: {
        type: Object as PropType<Option>,
        required: true
    },
    json: {
        type: Object as PropType<Serialize>,
        default: () => {
            return Serialize.empty()
        }
    }
})

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: Option): void, (e: 'success'): void }>()

const current: Option = $computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

let output = $ref("")
const lang = $computed(() => {
    return current.lang
})
let optionDefine = $ref<TargetOption[]>([])
let optionDefineToken = 0
let transformToken = 0

watch(() => current.lang, async () => {
    const token = ++optionDefineToken
    const lang = current.lang
    const define = await current.define()
    if (token === optionDefineToken && current.lang === lang) {
        optionDefine = define
    }
}, {immediate: true})

watch(() => {
    return {
        lang: current.lang,
        json: props.json,
        options: current.option
    }
}, async ({lang, json}) => {
    const token = ++transformToken
    if (json.isError()) {
        output = json.error();
        return;
    }
    if (json.isEmpty()) {
        output = "";
        return;
    }
    await current.define()
    const result = await transform(lang, json.toJson(), current.option[lang])
    if (token !== transformToken) {
        return
    }
    output = result
    emit('success')
}, {immediate: true, deep: true})

</script>
