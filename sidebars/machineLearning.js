module.exports = {
    machineLearning: [{
            type: 'doc',
            label: '机器学习笔记',
            id: 'intro',
        },
        {
            type: 'category',
            label: '线性模型',
            items: [{
                    type: 'doc',
                    label: '线性回归的数学表示',
                    id: 'linear-model/linear-regression'
                },
                {
                    type: 'doc',
                    label: '线性回归的求解',
                    id: 'linear-model/minimise-loss-function'
                },
                {
                    type: 'doc',
                    label: '最大似然估计',
                    id: 'linear-model/maximum-likelihood-estimation'
                },
                {
                    type: 'doc',
                    label: '过拟合和欠拟合',
                    id: 'linear-model/underfit-overfit'
                },
                {
                    type: 'doc',
                    label: '正则化',
                    id: 'linear-model/regularization'
                },
                {
                    type: 'doc',
                    label: 'Logistic Regression',
                    id: 'linear-model/logistic-regression'
                },
            ],
        },
        {
            type: 'category',
            label: '前馈神经网络',
            items: [{
                    type: 'doc',
                    label: '前馈神经网络',
                    id: 'neural-network/feedforward-neural-network'
                },
                {
                    type: 'doc',
                    label: 'Softmax',
                    id: 'neural-network/softmax'
                },
                {
                    type: 'doc',
                    label: 'PyTorch的Tensor和自动求导',
                    id: 'neural-network/pytorch-tensor-autograd'
                },
                {
                    type: 'doc',
                    label: '房价预测',
                    id: 'neural-network/pytorch-kaggle-house-prices'
                },
            ],
        },
        {
            type: 'category',
            label: '卷积神经网络',
            items: [{
                    type: 'doc',
                    label: '二维卷积层',
                    id: 'convolutional/two-dimension-convolution-layer'
                },
                {
                    type: 'doc',
                    label: '池化层',
                    id: 'convolutional/pooling'
                },
                {
                    type: 'doc',
                    label: 'LeNet',
                    id: 'convolutional/lenet'
                },
                {
                    type: 'doc',
                    label: 'AlexNet',
                    id: 'convolutional/alexnet'
                },
                {
                    type: 'doc',
                    label: 'VGG',
                    id: 'convolutional/vgg'
                },
                {
                    type: 'doc',
                    label: 'NiN',
                    id: 'convolutional/nin'
                },
                {
                    type: 'doc',
                    label: 'GoogLeNet',
                    id: 'convolutional/googlenet'
                },
                {
                    type: 'doc',
                    label: 'BatchNorm',
                    id: 'convolutional/batch-normalization'
                },
                {
                    type: 'doc',
                    label: 'ResNet',
                    id: 'convolutional/resnet'
                },
            ],
        },
        {
            type: 'category',
            label: '注意力机制',
            items: [{
                    type: 'doc',
                    label: '注意力机制',
                    id: 'attention/attention'
                },
                {
                    type: 'doc',
                    label: 'Transformer',
                    id: 'attention/transformer-attention'
                },
            ],
        },
    ],
};