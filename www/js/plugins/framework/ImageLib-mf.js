/*:
 * @plugindesc Image 工具插件
 *
 * @param file suffix
 * @desc 文件后缀
 * @default .mf.js
 * @author 玉米
 */
(function () {

    if (!$$$) {
        throw new Error("请调整插件执行顺序，ui主库js未能找到！")
        return;
    }

    $$$.$utils.image = {};
    $$$.$utils.image.filter = {};

    /**
     * 滤镜工具箱
     */
    let FilterToolkit = $$$.$utils.image.filter;

    /**
     *  黑白图像
     */
    FilterToolkit.blackWhite = function (imageData) {
        let d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            avg = Math.floor((d[i] + d[i + 1] + d[i + 2]) / 3);
            d[i] = avg;
            d[i + 1] = avg;
            d[i + 2] = avg;
        }
    };

    /**
     *  二值滤镜 原理：将当前像素的RGB值得最大值和最小值求平均值并作为新的RGB值。
     */
    FilterToolkit.clear = function (imageData) {
        let d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            let c = (Math.max(d[i] + d[i + 1] + d[i + 2]) + Math.min(d[i] + d[i + 1] + d[i + 2]) / 2) - 200;
            d[i] = c;
            d[i + 1] = c;
            d[i + 2] = c;
        }
    };

    /**
     *  图像反转
     */
    FilterToolkit.toggle = function (imageData) {
        let data = imageData.data;

        for (let i = 0, len = data.length; i < len; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
    };


    /**
     *  滤波
     *  函数第一个参数是 canvas上的 imageData 对象
     *  第二个参数是传入矩阵所对应的数组，如果是下面这样的矩阵
     *  a b c
     *  d e f
     *  g h i
     * 则传入第二个的参数应为 [a,b,c,d,e,f,g,h,i]
     */
    FilterToolkit.matrix = function (imageData, array) {

        let w = imageData.width, h = imageData.height;
        let data1 = imageData.data;
        let data2 = imageData.data;
        let a = array;
        for (let i = 0; i < h; i++) {  // 行
            for (let j = 0; j < w; j++) {  // 列
                for (let k = 0; k < 3; k++) {
                    let num = (i * w + j) * 4 + k;
                    let numUp = ((i - 1) * w + j) * 4 + k;
                    let numDown = ((i + 1) * w + j) * 4 + k;
                    data1[num] = -(a[0] * data2[numUp - 4] + a[1] * data2[numUp] + a[2] * data2[numUp + 4]
                        + a[3] * data2[num - 4] + a[4] * data2[num] + a[5] * data2[num + 4]
                        + a[6] * data2[numDown - 4] + a[7] * data2[numDown] + a[8] * data2[numDown + 4]);
                }
            }
        }
    };

    /**
     *  复古
     */
    FilterToolkit.sepia = function (imageData) {
        let d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            let r = d[i];
            let g = d[i + 1];
            let b = d[i + 2];
            d[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);

        }
    };

    /**
     *  红色蒙版
     */
    FilterToolkit.red = function red(imageData) {
        let d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            let r = d[i];
            let g = d[i + 1];
            let b = d[i + 2];
            d[i] = (r + g + b) / 3;
            d[i + 1] = 0;
            d[i + 2] = 0;
        }
    };

    /**
     *  增加亮度
     */
    FilterToolkit.brightness = function brightness(imageData, delta) {
        let d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            d[i] += delta;
            d[i + 1] += delta;
            d[i + 2] += delta;
        }
    };

    /**
     *  浮雕
     */
    FilterToolkit.carve = function (imageData) {
        let w = imageData.width, h = imageData.height;
        let data = imageData.data;

        for (let i = h; i > 0; i--) {  // 行
            for (let j = w; j > 0; j--) {  // 列
                for (let k = 0; k < 3; k++) {
                    let num = (i * w + j) * 4 + k;
                    let numUp = ((i - 1) * w + j) * 4 + k;
                    let numDown = ((i + 1) * w + j) * 4 + k;
                    data[num] = data[num] - data[numUp - 4] + 128;
                }
            }
        }
    };

    /**
     *  雾化
     */
    FilterToolkit.fog = function (imageData) {
        let w = imageData.width;
        let data = imageData.data;
        for (let i = h; i > 0; i--) {  // 行
            for (let j = w; j > 0; j--) {  // 列
                let num = (i * w + j) * 4;
                if (Math.random() < 0.5) {
                    data[num] = 255;
                    data[num + 1] = 255;
                    data[num + 2] = 255;
                }
            }
        }
    };

    /**
     * 毛玻璃效果
     * 原理：用当前点四周一定范围内任意一点的颜色来替代当前点颜色，最常用的是随机的采用相邻点进行替代。
     * @param canvasData
     */
    FilterToolkit.spread = function (canvasData) {
        let w = canvasData.width, h = canvasData.height;

        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                for (let k = 0; k < 3; k++) {
                    // Index of the pixel in the array  
                    let num = (i * w + j) * 4 + k;

                    let rand = Math.floor(Math.random() * 10) % 3;
                    let num2 = ((i + rand) * w + (j + rand)) * 4 + k;

                    canvasData.data[num] = canvasData.data[num2]
                    //canvasData.data[idx + 3] = 255; // Alpha channel    
                    // add black border  
                    //if(x < 4 || y < 4 || x > (canvasData.width - 4) || y > (canvasData.height - 4)) {  
                    //	canvasData.data[num] = 0;  
                    //}  
                }
            }
        }
    };


    /**
     *  马赛克
     * 将图像分成大小一致的图像块，每一个图像块都是一个正方形，
     * 并且在这个正方形中所有像素值都相等。我们可以将这个正方形看作是一个模板窗口，
     * 模板中对应的所有图像像素值都等于该模板的左上角第一个像素的像素值，
     * 这样的效果就是马赛克效果，而正方形模板的大小则决定了马赛克块的大小，即图像马赛克化的程度。
     */
    FilterToolkit.mosaic = function (imageData, size) {
        let w = imageData.width, h = imageData.height;
        let data = imageData.data;

        for (let i = 1; i < h - 1; i += size) {
            for (let j = 1; j < w - 1; j += size) {

                let num = (i * w + j) * 4;
                for (let dx = 0; dx < size; dx++) {
                    for (let dy = 0; dy < size; dy++) {
                        let x = i + dx;
                        let y = j + dy;
                        let p1 = (x * w + y) * 4;

                        data[p1 + 0] = data[num + 0];
                        data[p1 + 1] = data[num + 1];
                        data[p1 + 2] = data[num + 2];
                    }
                }
            }
        }
    };

    /**
     *  模糊滤镜 算法原理：将当前像素的周边像素的RGB值各自的平均值作为新的RGB值。
     */
    FilterToolkit.blur = function blur(imageData, array) {

        let w = imageData.width, h = imageData.height;
        let data1 = imageData.data;
        let data2 = imageData.data;
        let a = array;
        for (let i = 0; i < h; i++) {  // 行
            for (let j = 0; j < w; j++) {  // 列
                for (let k = 0; k < 3; k++) {
                    let num = (i * w + j) * 4 + k;
                    let numUp = ((i - 1) * w + j) * 4 + k;
                    let numDown = ((i + 1) * w + j) * 4 + k;
                    // 对另开内存的data1的改变为什么会反应到data中
                    data1[num] = (data2[numUp - 4] + data2[numUp] + data2[numUp + 4]
                        + data2[num - 4] + data2[num] + data2[num + 4]
                        + data2[numDown - 4] + data2[numDown] + data2[numDown + 4]) / 9;
                }
            }
        }
    };

    /**
     *  二值化
     */
    FilterToolkit.clear2 = function (imageData) {
        let d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                if (d[i + j] < 127) {
                    d[i + j] = 0;
                } else {
                    d[i + j] = 255;
                }
            }
        }
    };

}());