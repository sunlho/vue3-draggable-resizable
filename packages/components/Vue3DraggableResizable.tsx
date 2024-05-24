import { defineComponent, ref, toRef, h, Ref, inject, computed, onMounted } from "vue"
import { initDraggableContainer, watchProps, initState, initParent, initLimitSizeAndMethods, initResizeHandle } from "./hooks"
import "../index.css"
import { getElSize, filterHandles, IDENTITY } from "./utils"
import { UpdatePosition, GetPositionStore, ResizingHandle, ContainerProvider, SetMatchedLine } from "./types"

export const ALL_HANDLES: ResizingHandle[] = ["tl", "tm", "tr", "ml", "mr", "bl", "bm", "br"]

const VdrProps = {
  initW: {
    type: Number,
    default: null,
  },
  initH: {
    type: Number,
    default: null,
  },
  w: {
    type: Number,
    default: 0,
  },
  h: {
    type: Number,
    default: 0,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  resizable: {
    type: Boolean,
    default: true,
  },
  disabledX: {
    type: Boolean,
    default: false,
  },
  disabledY: {
    type: Boolean,
    default: false,
  },
  disabledW: {
    type: Boolean,
    default: false,
  },
  disabledH: {
    type: Boolean,
    default: false,
  },
  minW: {
    type: Number,
    default: 20,
  },
  minH: {
    type: Number,
    default: 20,
  },
  active: {
    type: Boolean,
    default: false,
  },
  parent: {
    type: Boolean,
    default: false,
  },
  handles: {
    type: Array,
    default: ALL_HANDLES,
    validator: (handles: ResizingHandle[]) => {
      return filterHandles(handles).length === handles.length
    },
  },
  classNameDraggable: {
    type: String,
    default: "draggable",
  },
  classNameResizable: {
    type: String,
    default: "resizable",
  },
  classNameDragging: {
    type: String,
    default: "dragging",
  },
  classNameResizing: {
    type: String,
    default: "resizing",
  },
  classNameActive: {
    type: String,
    default: "active",
  },
  classNameHandle: {
    type: String,
    default: "handle",
  },
  lockAspectRatio: {
    type: Boolean,
    default: false,
  },
}

const emits = [
  "activated",
  "deactivated",
  "drag-start",
  "resize-start",
  "dragging",
  "resizing",
  "drag-end",
  "resize-end",
  "update:w",
  "update:h",
  "update:x",
  "update:y",
  "update:active",
]

const VueDraggableResizable = defineComponent({
  name: "Vue3DraggableResizable",
  props: VdrProps,
  emits: emits,
  setup(props, { emit, slots }) {
    const containerProps = initState(props, emit)
    const provideIdentity = inject("identity", Symbol())
    let containerProvider: ContainerProvider | null = null
    if (provideIdentity === IDENTITY) {
      containerProvider = {
        updatePosition: inject<UpdatePosition>("updatePosition")!,
        getPositionStore: inject<GetPositionStore>("getPositionStore")!,
        disabled: inject<Ref<boolean>>("disabled")!,
        adsorbParent: inject<Ref<boolean>>("adsorbParent")!,
        adsorbCols: inject<number[]>("adsorbCols")!,
        adsorbRows: inject<number[]>("adsorbRows")!,
        setMatchedLine: inject<SetMatchedLine>("setMatchedLine")!,
      }
    }
    const containerRef = ref<HTMLElement>()
    const parentSize = initParent(containerRef)
    const limitProps = initLimitSizeAndMethods(props, parentSize, containerProps)
    initDraggableContainer(containerRef, containerProps, limitProps, toRef(props, "draggable"), emit, containerProvider, parentSize)
    const resizeHandle = initResizeHandle(containerProps, limitProps, parentSize, props, emit)
    watchProps(props, limitProps)
    const style = computed(() => {
      return {
        width: containerProps.width.value + "px",
        height: containerProps.height.value + "px",
        top: containerProps.top.value + "px",
        left: containerProps.left.value + "px",
      }
    })
    const klass = computed(() => {
      return {
        [props.classNameActive]: containerProps.enable.value,
        [props.classNameDragging]: containerProps.dragging.value,
        [props.classNameResizing]: containerProps.resizing.value,
        [props.classNameDraggable]: props.draggable,
        [props.classNameResizable]: props.resizable,
      }
    })
    onMounted(() => {
      if (!containerRef.value) return
      containerRef.value.ondragstart = () => false
      const { width, height } = getElSize(containerRef.value)
      limitProps.setWidth(props.initW === null ? props.w || width : props.initW)
      limitProps.setHeight(props.initH === null ? props.h || height : props.initH)
      if (containerProvider) {
        containerProvider.updatePosition(containerProps.id, {
          x: containerProps.left.value,
          y: containerProps.top.value,
          w: containerProps.width.value,
          h: containerProps.height.value,
        })
      }
    })

    return () => (
      <div ref={containerRef} class={["vdr-container", klass.value]} style={style.value}>
        {slots.default && slots.default()}
        {resizeHandle.handlesFiltered.value.map((item) => (
          <div
            class={["vdr-handle", "vdr-handle-" + item, props.classNameHandle, `${props.classNameHandle}-${item}`]}
            style={{ display: containerProps.enable.value ? "block" : "none" }}
            onMousedown={(e: MouseEvent) => resizeHandle.resizeHandleDown(e, item)}
            onTouchstart={(e: TouchEvent) => resizeHandle.resizeHandleDown(e, item)}
          />
        ))}
      </div>
    )
  },
})

export default VueDraggableResizable
