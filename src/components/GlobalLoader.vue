<template>
    <transition name="fade">
        <div v-if="isLoading" class="loader-overlay">
            <div class="loader-container">
                <b-spinner variant="primary"></b-spinner>
                <p class="mt-2">Cargando...</p>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'GlobalLoader',
    computed: {
        isLoading(): boolean {
            return this.$store.state.loader.isLoading;
        }
    }
});
</script>

<style scoped>
.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loader-container {
    text-align: center;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.fade-enter-active {
    animation: fadeIn 0.4s ease-out;
}

.fade-leave-active {
    animation: fadeOut 0.4s ease-in;
}
</style>
