<script lang="ts">
import { defineComponent, h, resolveComponent, useSlots } from 'vue'

export default defineComponent({
  setup() {
    const slots = useSlots()
    const PluginTabs = resolveComponent('PluginTabs')
    const PluginTabsTab = resolveComponent('PluginTabsTab')
    const [options, _hr, setup] = slots.default()

    return () =>
      setup
        ? h(
            PluginTabs,
            {
              sharedStateKey: 'code',
            },
            [
              h(PluginTabsTab, { label: 'Options API' }, options),
              h(PluginTabsTab, { label: 'Setup API' }, setup),
            ],
          )
        : h(options)
  },
})
</script>
