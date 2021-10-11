module.exports = {
    gpu: [{
            type: 'doc',
            label: 'GPU编程入门',
            id: 'intro',
        },
        {
            type: 'category',
            label: 'GPU基础知识',
            items: [{
                    type: 'doc',
                    label: '计算机体系结构',
                    id: 'gpu-basic/computer-arch'
                },
                {
                    type: 'doc',
                    label: 'GPU软硬件基础知识',
                    id: 'gpu-basic/gpu'
                },
                {
                    type: 'doc',
                    label: '2020年，人工智能研究者应该选择哪款显卡？',
                    id: 'gpu-basic/ai-gpu'
                },
            ],
        },
        {
            type: 'category',
            label: '使用Python Numba进行CUDA编程',
            items: [{
                    type: 'doc',
                    label: 'Numba简介',
                    id: 'python-cuda/numba'
                },
                {
                    type: 'doc',
                    label: '初识GPU编程',
                    id: 'python-cuda/cuda-intro'
                },
                {
                    type: 'doc',
                    label: '网格跨步',
                    id: 'python-cuda/stride'
                },
                {
                    type: 'doc',
                    label: '多流',
                    id: 'python-cuda/streams'
                },
                {
                    type: 'doc',
                    label: 'Shared Memory',
                    id: 'python-cuda/shared-memory'
                },
            ],
        },
    ],
};