<template>
  <div>
    <Button
      icon="pi pi-plus"
      label="Add Perfume"
      size="small"
      class="my-4"
      @click="openAddPerfumeDialog()"
    />
    <Dialog
      v-model:visible="visible"
      modal
      header="Add Perfume"
      class="w-[80vw]"
    >
      <Form
        v-slot="$form"
        :initial-values="initialValues"
        :resolver="resolver"
        :validateOnValueUpdate="false"
        :validate-on-blur="false"
        class="flex flex-col gap-4 w-full"
        @submit="onFormSubmit"
      >
        <div class="flex flex-col gap-1">
          <label for="name">Name&#42;</label>
          <InputText
            name="name"
            type="text"
            placeholder="Name"
            fluid
          />
          <Message
            v-if="$form.name?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.name.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="brand">Brand&#42;</label>
          <AutoComplete
            name="brand"
            option-label="name"
            fluid
            :suggestions="brands"
            placeholder="Brand"
            single
            @complete="searchBrand"
          />
          <Message
            v-if="$form.brand?.touched && $form.brand?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.brand.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="concentration">Concentration&#42;</label>
          <Select
            name="concentration"
            option-label="name"
            :options="concentrations"
            placeholder="Select a concentration"
            fluid
          />
          <Message
            v-if="$form.concentration?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.concentration.error.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="gender">Gender</label>
          <SelectButton
            v-model="selectedGender"
            name="gender"
            :options="genders"
          />
          <Message
            v-if="$form.gender?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.gender.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="discontinued">Discontinued?</label>
          <ToggleSwitch
            name="discontinued"
            size="small"
          />
          <Message
            v-if="$form.discontinued?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.discontinued.error?.message }}
          </Message>
        </div>

        <Button
          icon="pi pi-save"
          type="submit"
          label="Save"
          class="mt-4"
        />
      </Form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { supabase } from '@/supabaseClient.ts';
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';

type FormState = {
  name: { value: string };
  brand: { value: { id: string } };
  concentration: { value: { name: string } };
  gender: { value: string };
  discontinued: { value: boolean };
};

type FormSubmitState = {
  valid: boolean;
  states: FormState;
};

const visible = ref(false);
const initialValues = ref({
  name: '',
  brand: null,
  concentration: null,
  gender: 'Unisex',
  discontinued: false,
});

const brands = ref<{ id: number; name: string }[]>([]);

const concentrations = ref([
  { name: 'Body Spray' },
  { name: 'Eau de Cologne' },
  { name: 'Eau de Toilette' },
  { name: 'Eau de Parfum' },
  { name: 'Extrait de Parfum' },
  { name: 'Perfume Oil' }
]);

const selectedGender = ref('Unisex');
const genders = ref(['Unisex', 'Woman', 'Man']);

const openAddPerfumeDialog = () => {
  visible.value = true;
};

const searchBrand = async (event: AutoCompleteCompleteEvent) => {
  try {
    const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .ilike('name', `%${event.query}%`);

    if (error) {
      console.error('Error fetching data:', error);
      brands.value = [];
    } else {
      brands.value = data || [];
    }
  } catch (err) {
    console.error('Error:', err);
    brands.value = [];
  }
};

const zodSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  brand: z.object({ name: z.string() }).nullable().refine((b): b is { name: string } => b !== null, { message: 'Brand is required.' }),
  concentration: z.object({ name: z.string() }).nullable().refine((b): b is { name: string } => b !== null, { message: 'Concentration is required.' }),
});

const resolver = ref(zodResolver(zodSchema));

const onFormSubmit = async ({ valid, states }: FormSubmitState) => {
  if (valid) {
    const { error } = await supabase
        .from('perfumes')
        .insert({
          name: states.name.value,
          brand_id: states.brand.value.id,
          concentration: states.concentration.value.name,
          market_gender: (states.gender.value).toLowerCase(),
          discontinued: states.discontinued.value,
        })
        .select()
        .single();

    if (error) {
      console.error('Error inserting perfume:', error);
      return;
    }
  }
};
</script>
