/*:
 * @plugindesc 扩展工具集
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
    /**
     * 定义工具集
     */
    (function (utils) {
        utils.lang = {};
        utils.lang.isNotBlank = function (value) {
            if (typeof value === "undefined") {
                return false;
            }

            if (value == null || value.trim().length == 0) {
                return false;
            }

            return true;
        };
        utils.lang.isEnable = function (parameters, name) {
            let enable = (isNotBlank(parameters[name]) && parameters[name] === 'on');
            return enable;
        };

        utils.lang.isNumber = function (value) {
            return typeof value === "number";
        };

        utils.lang.isFunction = function (value) {
            return typeof value === "function";
        };

        utils.lang.isString = function (value) {
            return typeof value === "string";
        };

        utils.lang.isObject = function (value) {
            return typeof value === "object";
        };

        utils.lang.isUndefined = function (value) {
            return typeof value === "undefined";
        };

        /**
         * uuid生成
         * @param len 长度
         * @param radix 基数
         * @returns {string}
         */
        utils.lang.uuid = function (len, radix) {
            let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                let r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        };

        /**
         * 随机整数
         * @param left 左区间
         * @param right 右区间
         * @returns {number} 数
         */
        utils.lang.randomInt = function (left, right) {
            var random = Math.floor(Math.random() * (right - left + 1) + left);
            return random;
        };

        utils.lang.Snowflake = (function () {
            function Snowflake(_workerId, _dataCenterId, _sequence) {
                this.twepoch = 1288834974657n;
                //this.twepoch = 0n;
                this.workerIdBits = 5n;
                this.dataCenterIdBits = 5n;
                this.maxWrokerId = -1n ^ (-1n << this.workerIdBits); // 值为：31
                this.maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits); // 值为：31
                this.sequenceBits = 12n;
                this.workerIdShift = this.sequenceBits; // 值为：12
                this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：17
                this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：22
                this.sequenceMask = -1n ^ (-1n << this.sequenceBits); // 值为：4095
                this.lastTimestamp = -1n;
                //设置默认值,从环境变量取
                this.workerId = 1n;
                this.dataCenterId = 1n;
                this.sequence = 0n;
                if (this.workerId > this.maxWrokerId || this.workerId < 0) {
                    throw new Error('_workerId must max than 0 and small than maxWrokerId-[' + this.maxWrokerId + ']');
                }
                if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
                    throw new Error('_dataCenterId must max than 0 and small than maxDataCenterId-[' + this.maxDataCenterId + ']');
                }

                this.workerId = BigInt(_workerId);
                this.dataCenterId = BigInt(_dataCenterId);
                this.sequence = BigInt(_sequence);
            }

            Snowflake.prototype.tilNextMillis = function (lastTimestamp) {
                var timestamp = this.timeGen();
                while (timestamp <= lastTimestamp) {
                    timestamp = this.timeGen();
                }
                return BigInt(timestamp);
            };
            Snowflake.prototype.timeGen = function () {
                return BigInt(Date.now());
            };
            Snowflake.prototype.nextId = function () {
                var timestamp = this.timeGen();
                if (timestamp < this.lastTimestamp) {
                    throw new Error('Clock moved backwards. Refusing to generate id for ' +
                        (this.lastTimestamp - timestamp));
                }
                if (this.lastTimestamp === timestamp) {
                    this.sequence = (this.sequence + 1n) & this.sequenceMask;
                    if (this.sequence === 0n) {
                        timestamp = this.tilNextMillis(this.lastTimestamp);
                    }
                } else {
                    this.sequence = 0n;
                }
                this.lastTimestamp = timestamp;
                return ((timestamp - this.twepoch) << this.timestampLeftShift) |
                    (this.dataCenterId << this.dataCenterIdShift) |
                    (this.workerId << this.workerIdShift) |
                    this.sequence;
            };
            return Snowflake;
        }());

    }.bind($$$.$utils)());
});