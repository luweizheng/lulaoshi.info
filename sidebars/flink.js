module.exports = {
    flink: [{
            type: 'doc',
            label: 'Flink原理与实践',
            id: 'intro',
        },
        {
            type: 'category',
            label: 'Flink的设计与运行原理',
            items: [{
                type: 'doc',
                label: '数据流图简介',
                id: 'chapter-system-design/dataflow'
            }, {
                type: 'doc',
                label: 'Flink架构与核心组件',
                id: 'chapter-system-design/flink-core'
            }, {
                type: 'doc',
                label: 'Flink架构与核心组件',
                id: 'chapter-system-design/task-resource'
            }, {
                type: 'doc',
                label: '习题 WordCount',
                id: 'chapter-system-design/exercise-wordcount'
            }, ],
        },
        {
            type: 'category',
            label: 'DataStream API',
            items: [{
                type: 'doc',
                label: 'Flink程序的骨架结构',
                id: 'chapter-datastream-api/skeleton'
            }, {
                type: 'doc',
                label: 'Transformations',
                id: 'chapter-datastream-api/transformations'
            }, {
                type: 'doc',
                label: '数据类型和序列化',
                id: 'chapter-datastream-api/data-types'
            }, {
                type: 'doc',
                label: '用户自定义函数',
                id: 'chapter-datastream-api/user-define-functions'
            }, {
                type: 'doc',
                label: '习题 股票数据流处理',
                id: 'chapter-datastream-api/exercise-stock-basic'
            }, ],
        },
        {
            type: 'category',
            label: '时间和窗口',
            items: [{
                type: 'doc',
                label: 'Flink的时间语义',
                id: 'chapter-time-window/time'
            }, {
                type: 'doc',
                label: 'ProcessFunction',
                id: 'chapter-time-window/process-function'
            }, {
                type: 'doc',
                label: '窗口算子',
                id: 'chapter-time-window/window'
            }, {
                type: 'doc',
                label: '双流关联',
                id: 'chapter-time-window/join'
            }, {
                type: 'doc',
                label: '处理迟到数据',
                id: 'chapter-time-window/late-elements'
            }, {
                type: 'doc',
                label: '习题 股票价格数据进阶分析',
                id: 'chapter-time-window/exercise-stock'
            }, ],
        },
        {
            type: 'category',
            label: '状态、检查点和保存点',
            items: [{
                type: 'doc',
                label: '有状态的计算',
                id: 'chapter-state-checkpoint/state'
            }, {
                type: 'doc',
                label: 'Checkpoint',
                id: 'chapter-state-checkpoint/checkpoint'
            }, {
                type: 'doc',
                label: 'Savepoint',
                id: 'chapter-state-checkpoint/savepoint'
            }, {
                type: 'doc',
                label: '习题 电商平台用户行为分析',
                id: 'chapter-state-checkpoint/exercise-state'
            }, ],
        },
        {
            type: 'category',
            label: 'Table API & SQL',
            items: [{
                type: 'doc',
                label: 'Table API & SQL',
                id: 'chapter-table-sql/index'
            }, {
                type: 'doc',
                label: 'Table API & SQL综述',
                id: 'chapter-table-sql/table-overview'
            }, {
                type: 'doc',
                label: '动态表和持续查询',
                id: 'chapter-table-sql/dynamic-table'
            }, {
                type: 'doc',
                label: '时间和窗口',
                id: 'chapter-table-sql/window'
            }, {
                type: 'doc',
                label: 'Join',
                id: 'chapter-table-sql/join'
            }, {
                type: 'doc',
                label: 'SQL DDL',
                id: 'chapter-table-sql/sql-ddl'
            }, {
                type: 'doc',
                label: '系统函数',
                id: 'chapter-table-sql/system-function'
            }, {
                type: 'doc',
                label: '用户自定义函数',
                id: 'chapter-table-sql/catalog-function'
            }, {
                type: 'doc',
                label: '习题 使用Flink SQL处理IoT数据',
                id: 'chapter-table-sql/exercise-iot'
            }, ],
        },
    ],
};