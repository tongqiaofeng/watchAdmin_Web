// 按需导入echart
import * as echarts from 'echarts';

// 引入类型
import {
  PieChart,
  BarChart,
  LineChart
} from 'echarts/charts';


// 引入提示框，标题，直角坐标系等组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
  SVGRenderer
} from 'echarts/renderers'

echarts.use(
  [
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    PieChart,
    SVGRenderer,
    BarChart,
    LineChart
  ]
)

export default echarts;