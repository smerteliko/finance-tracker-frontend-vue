<template>
  <div
    class="modal fade"
    id="accountModal"
    tabindex="-1"
    aria-labelledby="accountModalLabel"
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="accountModalLabel">{{ t('accountForm.title') }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAccount">
            <div class="mb-3">
              <label for="name" class="form-label">{{ t('accountForm.name') }}</label>
              <input type="text" class="form-control" id="name" v-model="form.name" required />
            </div>
            <div class="mb-3">
              <label for="type" class="form-label">{{ t('accountForm.type') }}</label>
              <select class="form-select" id="type" v-model="form.type" required>
                <option :value="undefined" disabled>{{ t('accountForm.selectType') }}</option>
                <option v-for="type in AccountTypeEnum" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="initialBalance" class="form-label">{{ t('accountForm.initialBalance') }}</label>
              <input
                type="number"
                step="0.01"
                class="form-control"
                id="initialBalance"
                v-model.number="form.initialBalance"
                required
              />
            </div>
            <div class="mb-3">
              <label for="currency" class="form-label">{{ t('accountForm.currency') }}</label>
              <input type="text" class="form-control" id="currency" v-model="form.currency" maxlength="5" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                {{ t('general.close') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ t('general.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Modal } from 'bootstrap';
import { useAccountStore } from '@/stores/accountStore';
import { AccountTypeEnum, type AccountPayload } from '@/types'; // Import necessary types

const { t } = useI18n();
const accountStore = useAccountStore();
const emit = defineEmits(['accountSaved']);

const modalElement = ref<HTMLElement | null>(null);
let bootstrapModal: Modal | null = null;
const loading = ref(false);

const form = reactive<AccountPayload>({
  name: '',
  type: undefined as unknown as AccountTypeEnum,
  initialBalance: 0,
  currency: 'USD',
});

const saveAccount = async () => {
  if (!form.type) {
    alert(t('errors.selectAccountType'));
    return;
  }

  loading.value = true;
  try {
    await accountStore.createAccount(form, t);

    // Close modal and emit event
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
    emit('accountSaved');

  } catch (error) {
    console.error('Failed to save account:', error);
    alert(accountStore.error || t('errors.createAccountFailed'));
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.name = '';
  form.type = undefined as unknown as AccountTypeEnum;
  form.initialBalance = 0;
  form.currency = 'USD';
};

onMounted(() => {
  if (modalElement.value) {
    bootstrapModal = new Modal(modalElement.value);
    modalElement.value.addEventListener('show.bs.modal', resetForm);
  }
});
</script>
