import { createApp } from 'vue';
import FileloadApp from './App.vue';
import store from './store';

createApp(FileloadApp).use(store).mount('#checkDetailFileload');
