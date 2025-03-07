!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? e(exports, require("chart.js"), require("chart.js/helpers"))
        : "function" == typeof define && define.amd
        ? define(["exports", "chart.js", "chart.js/helpers"], e)
        : e(
              ((t =
                  "undefined" != typeof globalThis
                      ? globalThis
                      : t || self).ChartBoxPlot = {}),
              t.Chart,
              t.Chart.helpers
          );
})(this, function (t, e, r) {
    "use strict";
    const i = Math.sqrt(2 * Math.PI);
    function o(t) {
        const e = t.items.length,
            r = (function (t, e, r) {
                let i = Math.sqrt(
                    (function (t, e) {
                        return (t * e) / (e - 1);
                    })(e, r)
                );
                return (
                    "number" == typeof t && (i = Math.min(i, t / 1.34)),
                    1.06 * i * Math.pow(r, -0.2)
                );
            })(t.iqr, t.variance, e);
        return (o) => {
            let n = 0,
                s = 0;
            for (n = 0; n < e; n++) {
                const e = t.items[n];
                s += ((a = (o - e) / r), Math.exp(-0.5 * a * a) / i);
            }
            var a;
            return s / r / e;
        };
    }
    function n(t, e, r) {
        const i = e - 1,
            o = (e) => {
                const o = e * i,
                    n = Math.floor(o),
                    s = o - n,
                    a = t[n];
                return 0 === s ? a : r(a, t[Math.min(n + 1, i)], s);
            };
        return { q1: o(0.25), median: o(0.5), q3: o(0.75) };
    }
    function s(t, e = t.length) {
        return n(t, e, (t, e, r) => t + r * (e - t));
    }
    function a(t, e = t.length) {
        return n(t, e, (t, e, r) => t + (e - t) * r);
    }
    function l(t, e = t.length) {
        return n(t, e, (t) => t);
    }
    function u(t, e = t.length) {
        return n(t, e, (t, e) => e);
    }
    function m(t, e = t.length) {
        return n(t, e, (t, e, r) => (r < 0.5 ? t : e));
    }
    function d(t, e = t.length) {
        return n(t, e, (t, e) => 0.5 * (t + e));
    }
    function h(t, e = t.length) {
        const r = e,
            i = Math.floor((r + 3) / 2) / 2,
            o = (e) => 0.5 * (t[Math.floor(e) - 1] + t[Math.ceil(e) - 1]);
        return { q1: o(i), median: o((r + 1) / 2), q3: o(r + 1 - i) };
    }
    function c(t, e = t.length) {
        return h(t, e);
    }
    function f(t, e, r, i, { eps: o, quantiles: n, coef: s, whiskersMode: a }) {
        const l = (t, e) => Math.abs(t - e) < o,
            { median: u, q1: m, q3: d } = n(t, e),
            h = d - m,
            c = "number" == typeof s && s > 0;
        let f = c ? Math.max(r, m - s * h) : r,
            g = c ? Math.min(i, d + s * h) : i;
        const p = [];
        for (let r = 0; r < e; r += 1) {
            const e = t[r];
            if (e >= f || l(e, f)) {
                "nearest" === a && (f = e);
                break;
            }
            (0 !== p.length && l(p[p.length - 1], e)) || p.push(e);
        }
        const x = [];
        for (let r = e - 1; r >= 0; r -= 1) {
            const e = t[r];
            if (e <= g || l(e, g)) {
                "nearest" === a && (g = e);
                break;
            }
            (0 !== x.length && l(x[x.length - 1], e)) ||
                (0 !== p.length && l(p[p.length - 1], e)) ||
                x.push(e);
        }
        return {
            median: u,
            q1: m,
            q3: d,
            iqr: h,
            outlier: p.concat(x.reverse()),
            whiskerHigh: g,
            whiskerLow: f
        };
    }
    function g(t, e) {
        let r = 0;
        for (let i = 0; i < e; i++) {
            r += t[i];
        }
        r /= e;
        let i = 0;
        for (let o = 0; o < e; o++) {
            const e = t[o];
            i += (e - r) * (e - r);
        }
        return (i /= e), { mean: r, variance: i };
    }
    function p(t, e = {}) {
        const r = {
                coef: 1.5,
                eps: 0.01,
                quantiles: s,
                validAndSorted: !1,
                whiskersMode: "nearest",
                ...e
            },
            {
                missing: i,
                s: n,
                min: a,
                max: l
            } = r.validAndSorted
                ? (function (t) {
                      return 0 === t.length
                          ? {
                                min: Number.NaN,
                                max: Number.NaN,
                                missing: 0,
                                s: []
                            }
                          : {
                                min: t[0],
                                max: t[t.length - 1],
                                missing: 0,
                                s: t
                            };
                  })(t)
                : (function (t) {
                      let e = 0;
                      const { length: r } = t,
                          i =
                              t instanceof Float64Array
                                  ? new Float64Array(r)
                                  : new Float32Array(r);
                      for (let o = 0; o < r; o += 1) {
                          const r = t[o];
                          null == r ||
                              Number.isNaN(r) ||
                              ((i[e] = r), (e += 1));
                      }
                      const o = r - e;
                      if (0 === e)
                          return {
                              min: Number.NaN,
                              max: Number.NaN,
                              missing: o,
                              s: []
                          };
                      const n = e === r ? i : i.subarray(0, e);
                      return (
                          n.sort((t, e) => (t === e ? 0 : t < e ? -1 : 1)),
                          { min: n[0], max: n[n.length - 1], missing: o, s: n }
                      );
                  })(t),
            u = {
                min: Number.NaN,
                max: Number.NaN,
                mean: Number.NaN,
                missing: i,
                iqr: Number.NaN,
                count: t.length,
                whiskerHigh: Number.NaN,
                whiskerLow: Number.NaN,
                outlier: [],
                median: Number.NaN,
                q1: Number.NaN,
                q3: Number.NaN,
                variance: 0,
                items: [],
                kde: () => 0
            },
            m = t.length - i;
        if (0 === m) return u;
        const d = {
            min: a,
            max: l,
            count: t.length,
            missing: i,
            items: n,
            ...g(n, m),
            ...f(n, m, a, l, r)
        };
        return { ...d, kde: o(d) };
    }
    const x = { coef: 1.5, quantiles: 7 };
    function y(t) {
        const e = null == t || "number" != typeof t.coef ? x.coef : t.coef,
            r = (function (t) {
                return "function" == typeof t
                    ? t
                    : {
                          hinges: c,
                          fivenum: h,
                          7: s,
                          quantiles: s,
                          linear: a,
                          lower: l,
                          higher: u,
                          nearest: m,
                          midpoint: d
                      }[t] || s;
            })(null == t || null == t.quantiles ? s : t.quantiles);
        return { coef: e, quantiles: r };
    }
    function b(t, e) {
        if (t) {
            if (
                "number" == typeof t.median &&
                "number" == typeof t.q1 &&
                "number" == typeof t.q3
            ) {
                if (void 0 === t.whiskerMin) {
                    const { coef: r } = y(e),
                        { whiskerMin: i, whiskerMax: o } = (function (
                            t,
                            e,
                            r = 1.5
                        ) {
                            const i = t.q3 - t.q1,
                                o = "number" == typeof r && r > 0;
                            let n = o ? Math.max(t.min, t.q1 - r * i) : t.min,
                                s = o ? Math.min(t.max, t.q3 + r * i) : t.max;
                            if (Array.isArray(e)) {
                                for (let t = 0; t < e.length; t += 1) {
                                    const r = e[t];
                                    if (r >= n) {
                                        n = r;
                                        break;
                                    }
                                }
                                for (let t = e.length - 1; t >= 0; t -= 1) {
                                    const r = e[t];
                                    if (r <= s) {
                                        s = r;
                                        break;
                                    }
                                }
                            }
                            return { whiskerMin: n, whiskerMax: s };
                        })(
                            t,
                            Array.isArray(t.items)
                                ? t.items.slice().sort((t, e) => t - e)
                                : null,
                            r
                        );
                    (t.whiskerMin = i), (t.whiskerMax = o);
                }
                return t;
            }
            if (Array.isArray(t))
                return (function (t, e) {
                    const r = p(t, y(e));
                    return {
                        items: Array.from(r.items),
                        outliers: r.outlier,
                        whiskerMax: r.whiskerHigh,
                        whiskerMin: r.whiskerLow,
                        max: r.max,
                        median: r.median,
                        mean: r.mean,
                        min: r.min,
                        q1: r.q1,
                        q3: r.q3
                    };
                })(t, e);
        }
    }
    function w(t, e) {
        if (t) {
            if ("number" == typeof t.median && Array.isArray(t.coords))
                return t;
            if (Array.isArray(t))
                return (function (t, e) {
                    if (0 === t.length) return;
                    const r = p(t, y(e)),
                        i = (function (t, e, r) {
                            const i = [],
                                o = (e - t) / r;
                            for (let r = t; r <= e && o > 0; r += o) i.push(r);
                            return i[i.length - 1] !== e && i.push(e), i;
                        })(r.min, r.max, e.points).map((t) => ({
                            v: t,
                            estimate: r.kde(t)
                        })),
                        o = i.reduce(
                            (t, e) => Math.max(t, e.estimate),
                            Number.NEGATIVE_INFINITY
                        );
                    return {
                        max: r.max,
                        min: r.min,
                        mean: r.mean,
                        median: r.median,
                        q1: r.q1,
                        q3: r.q3,
                        items: Array.from(r.items),
                        coords: i,
                        outliers: [],
                        maxEstimate: o
                    };
                })(t, e);
        }
    }
    const q = {
        number: (t, e, r) =>
            t === e || null == t ? e : null == e ? t : t + (e - t) * r
    };
    function k(t, e, r) {
        return "number" == typeof t && "number" == typeof e
            ? q.number(t, e, r)
            : Array.isArray(t) && Array.isArray(e)
            ? e.map((e, i) => q.number(t[i], e, r))
            : e;
    }
    function M(t) {
        const e = t.formattedValue,
            r = this;
        e &&
            null != r._tooltipOutlier &&
            t.datasetIndex === r._tooltipOutlier.datasetIndex &&
            (e.hoveredOutlierIndex = r._tooltipOutlier.index);
    }
    function C(t, e) {
        if (!t.length) return !1;
        let r = 0,
            i = 0,
            o = 0;
        for (let n = 0; n < t.length; n += 1) {
            const s = t[n].element;
            if (s && s.hasValue()) {
                const t = s.tooltipPosition(e, this);
                (r += t.x), (i += t.y), (o += 1);
            }
        }
        return { x: r / o, y: i / o };
    }
    function v(t) {
        const e = ["borderColor", "backgroundColor"].concat(
            t.filter((t) => t.endsWith("Color"))
        );
        return {
            animations: {
                numberArray: { fn: k, properties: ["outliers", "items"] },
                colors: { type: "color", properties: e }
            },
            transitions: {
                show: {
                    animations: {
                        colors: {
                            type: "color",
                            properties: e,
                            from: "transparent"
                        }
                    }
                },
                hide: {
                    animations: {
                        colors: {
                            type: "color",
                            properties: e,
                            to: "transparent"
                        }
                    }
                }
            },
            minStats: "min",
            maxStats: "max",
            ...x
        };
    }
    function N() {
        return {
            plugins: {
                tooltip: {
                    position: C.register().id,
                    callbacks: { beforeLabel: M }
                }
            }
        };
    }
    (C.id = "average"),
        (C.register = () => ((e.Tooltip.positioners.average = C), C));
    class _ extends e.BarController {
        _transformStats(t, e, r) {
            for (const i of ["min", "max", "median", "q3", "q1", "mean"]) {
                const o = e[i];
                "number" == typeof o && (t[i] = r(o));
            }
            for (const i of ["outliers", "items"])
                Array.isArray(e[i]) && (t[i] = e[i].map(r));
        }
        getMinMax(t, e) {
            const r = t.axis,
                i = this.options;
            t.axis = i.minStats;
            const { min: o } = super.getMinMax(t, e);
            t.axis = i.maxStats;
            const { max: n } = super.getMinMax(t, e);
            return (t.axis = r), { min: o, max: n };
        }
        parsePrimitiveData(t, e, r, i) {
            const o = t.vScale,
                n = t.iScale,
                s = n.getLabels(),
                a = [];
            for (let t = 0; t < i; t += 1) {
                const i = t + r,
                    l = {};
                l[n.axis] = n.parse(s[i], i);
                const u = this._parseStats(
                    null == e ? null : e[i],
                    this.options
                );
                u && (Object.assign(l, u), (l[o.axis] = u.median)), a.push(l);
            }
            return a;
        }
        parseArrayData(t, e, r, i) {
            return this.parsePrimitiveData(t, e, r, i);
        }
        parseObjectData(t, e, r, i) {
            return this.parsePrimitiveData(t, e, r, i);
        }
        getLabelAndValue(t) {
            const e = super.getLabelAndValue(t),
                { vScale: r } = this._cachedMeta,
                i = this.getParsed(t);
            if (!r || !i || "NaN" === e.value) return e;
            (e.value = { raw: i, hoveredOutlierIndex: -1 }),
                this._transformStats(e.value, i, (t) => r.getLabelForValue(t));
            const o = this._toStringStats(e.value.raw);
            return (
                (e.value.toString = function () {
                    return this.hoveredOutlierIndex >= 0
                        ? `(outlier: ${
                              this.outliers[this.hoveredOutlierIndex]
                          })`
                        : o;
                }),
                e
            );
        }
        _toStringStats(t) {
            const e = (t) =>
                null == t
                    ? "NaN"
                    : r.formatNumber(t, this.chart.options.locale, {});
            return `(min: ${e(
                t.min
            )}, 25% quantile: ${e(t.q1)}, median: ${e(t.median)}, mean: ${e(t.mean)}, 75% quantile: ${e(t.q3)}, max: ${e(t.max)})`;
        }
        updateElement(t, e, r, i) {
            const o = "reset" === i,
                n = this._cachedMeta.vScale,
                s = this.getParsed(e),
                a = n.getBasePixel();
            (r._datasetIndex = this.index),
                (r._index = e),
                this._transformStats(r, s, (t) =>
                    o ? a : n.getPixelForValue(t, e)
                ),
                super.updateElement(t, e, r, i);
        }
    }
    const B = {
            borderWidth: 1,
            outlierStyle: "circle",
            outlierRadius: 2,
            outlierBorderWidth: 1,
            itemStyle: "circle",
            itemRadius: 0,
            itemBorderWidth: 0,
            meanStyle: "circle",
            meanRadius: 3,
            meanBorderWidth: 1,
            hitPadding: 2,
            outlierHitRadius: 4
        },
        S = {
            outlierBackgroundColor: "backgroundColor",
            outlierBorderColor: "borderColor",
            itemBackgroundColor: "backgroundColor",
            itemBorderColor: "borderColor",
            meanBackgroundColor: "backgroundColor",
            meanBorderColor: "borderColor"
        },
        P = Object.keys(B).concat(Object.keys(S));
    class T extends e.Element {
        isVertical() {
            return !this.horizontal;
        }
        _drawItems(t) {
            const e = this.isVertical(),
                i = this.getProps([
                    "x",
                    "y",
                    "items",
                    "width",
                    "height",
                    "outliers"
                ]),
                { options: o } = this;
            if (o.itemRadius <= 0 || !i.items || i.items.length <= 0) return;
            t.save(),
                (t.strokeStyle = o.itemBorderColor),
                (t.fillStyle = o.itemBackgroundColor),
                (t.lineWidth = o.itemBorderWidth);
            const n = (function (t = Date.now()) {
                    let e = t;
                    return () => (
                        (e = (9301 * e + 49297) % 233280), e / 233280
                    );
                })(1e3 * this._datasetIndex + this._index),
                s = {
                    pointStyle: o.itemStyle,
                    radius: o.itemRadius,
                    borderWidth: o.itemBorderWidth
                },
                a = new Set(i.outliers || []);
            e
                ? i.items.forEach((e) => {
                      a.has(e) ||
                          r.drawPoint(
                              t,
                              s,
                              i.x - i.width / 2 + n() * i.width,
                              e
                          );
                  })
                : i.items.forEach((e) => {
                      a.has(e) ||
                          r.drawPoint(
                              t,
                              s,
                              e,
                              i.y - i.height / 2 + n() * i.height
                          );
                  }),
                t.restore();
        }
        _drawOutliers(t) {
            const e = this.isVertical(),
                i = this.getProps(["x", "y", "outliers"]),
                { options: o } = this;
            if (o.outlierRadius <= 0 || !i.outliers || 0 === i.outliers.length)
                return;
            t.save(),
                (t.fillStyle = o.outlierBackgroundColor),
                (t.strokeStyle = o.outlierBorderColor),
                (t.lineWidth = o.outlierBorderWidth);
            const n = {
                pointStyle: o.outlierStyle,
                radius: o.outlierRadius,
                borderWidth: o.outlierBorderWidth
            };
            e
                ? i.outliers.forEach((e) => {
                      r.drawPoint(t, n, i.x, e);
                  })
                : i.outliers.forEach((e) => {
                      r.drawPoint(t, n, e, i.y);
                  }),
                t.restore();
        }
        _drawMeanDot(t) {
            const e = this.isVertical(),
                i = this.getProps(["x", "y", "mean"]),
                { options: o } = this;
            if (o.meanRadius <= 0 || null == i.mean || Number.isNaN(i.mean))
                return;
            t.save(),
                (t.fillStyle = o.meanBackgroundColor),
                (t.strokeStyle = o.meanBorderColor),
                (t.lineWidth = o.meanBorderWidth);
            const n = {
                pointStyle: o.meanStyle,
                radius: o.meanRadius,
                borderWidth: o.meanBorderWidth
            };
            e ? r.drawPoint(t, n, i.x, i.mean) : r.drawPoint(t, n, i.mean, i.y),
                t.restore();
        }
        _getBounds(t) {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        }
        _getHitBounds(t) {
            const e = this.options.hitPadding,
                r = this._getBounds(t);
            return {
                left: r.left - e,
                top: r.top - e,
                right: r.right + e,
                bottom: r.bottom + e
            };
        }
        inRange(t, e, r) {
            return (
                (!Number.isNaN(this.x) || !Number.isNaN(this.y)) &&
                (this._boxInRange(t, e, r) ||
                    this._outlierIndexInRange(t, e, r) >= 0)
            );
        }
        inXRange(t, e) {
            const r = this._getHitBounds(e);
            return t >= r.left && t <= r.right;
        }
        inYRange(t, e) {
            const r = this._getHitBounds(e);
            return t >= r.top && t <= r.bottom;
        }
        _outlierIndexInRange(t, e, r) {
            const i = this.getProps(["x", "y"], r),
                o = this.options.outlierHitRadius,
                n = this._getOutliers(r),
                s = this.isVertical();
            if ((s && Math.abs(t - i.x) > o) || (!s && Math.abs(e - i.y) > o))
                return -1;
            const a = s ? e : t;
            for (let t = 0; t < n.length; t += 1)
                if (Math.abs(n[t] - a) <= o) return t;
            return -1;
        }
        _boxInRange(t, e, r) {
            const i = this._getHitBounds(r);
            return t >= i.left && t <= i.right && e >= i.top && e <= i.bottom;
        }
        getCenterPoint(t) {
            const e = this.getProps(["x", "y"], t);
            return { x: e.x, y: e.y };
        }
        _getOutliers(t) {
            return this.getProps(["outliers"], t).outliers || [];
        }
        tooltipPosition(t, e) {
            if (!t || "boolean" == typeof t) return this.getCenterPoint();
            e && delete e._tooltipOutlier;
            const r = this.getProps(["x", "y"]),
                i = this._outlierIndexInRange(t.x, t.y);
            return i < 0 || !e
                ? this.getCenterPoint()
                : ((e._tooltipOutlier = {
                      index: i,
                      datasetIndex: this._datasetIndex
                  }),
                  this.isVertical()
                      ? { x: r.x, y: this._getOutliers()[i] }
                      : { x: this._getOutliers()[i], y: r.y });
        }
    }
    const A = P.concat(["medianColor", "lowerBackgroundColor"]);
    class R extends T {
        draw(t) {
            t.save(),
                (t.fillStyle = this.options.backgroundColor),
                (t.strokeStyle = this.options.borderColor),
                (t.lineWidth = this.options.borderWidth),
                this._drawBoxPlot(t),
                this._drawOutliers(t),
                this._drawMeanDot(t),
                t.restore(),
                this._drawItems(t);
        }
        _drawBoxPlot(t) {
            this.isVertical()
                ? this._drawBoxPlotVertical(t)
                : this._drawBoxPlotHorizontal(t);
        }
        _drawBoxPlotVertical(t) {
            const { options: e } = this,
                r = this.getProps([
                    "x",
                    "width",
                    "q1",
                    "q3",
                    "median",
                    "whiskerMin",
                    "whiskerMax"
                ]),
                { x: i } = r,
                { width: o } = r,
                n = i - o / 2;
            r.q3 > r.q1
                ? t.fillRect(n, r.q1, o, r.q3 - r.q1)
                : t.fillRect(n, r.q3, o, r.q1 - r.q3),
                t.save(),
                e.medianColor &&
                    "transparent" !== e.medianColor &&
                    "#0000" !== e.medianColor &&
                    (t.strokeStyle = e.medianColor),
                t.beginPath(),
                t.moveTo(n, r.median),
                t.lineTo(n + o, r.median),
                t.closePath(),
                t.stroke(),
                t.restore(),
                t.save(),
                e.lowerBackgroundColor &&
                    "transparent" !== e.lowerBackgroundColor &&
                    "#0000" !== e.lowerBackgroundColor &&
                    ((t.fillStyle = e.lowerBackgroundColor),
                    r.q3 > r.q1
                        ? t.fillRect(n, r.median, o, r.q3 - r.median)
                        : t.fillRect(n, r.median, o, r.q1 - r.median)),
                t.restore(),
                r.q3 > r.q1
                    ? t.strokeRect(n, r.q1, o, r.q3 - r.q1)
                    : t.strokeRect(n, r.q3, o, r.q1 - r.q3),
                t.beginPath(),
                t.moveTo(n, r.whiskerMin),
                t.lineTo(n + o, r.whiskerMin),
                t.moveTo(i, r.whiskerMin),
                t.lineTo(i, r.q1),
                t.moveTo(n, r.whiskerMax),
                t.lineTo(n + o, r.whiskerMax),
                t.moveTo(i, r.whiskerMax),
                t.lineTo(i, r.q3),
                t.closePath(),
                t.stroke();
        }
        _drawBoxPlotHorizontal(t) {
            const { options: e } = this,
                r = this.getProps([
                    "y",
                    "height",
                    "q1",
                    "q3",
                    "median",
                    "whiskerMin",
                    "whiskerMax"
                ]),
                { y: i } = r,
                { height: o } = r,
                n = i - o / 2;
            r.q3 > r.q1
                ? t.fillRect(r.q1, n, r.q3 - r.q1, o)
                : t.fillRect(r.q3, n, r.q1 - r.q3, o),
                t.save(),
                e.medianColor &&
                    "transparent" !== e.medianColor &&
                    (t.strokeStyle = e.medianColor),
                t.beginPath(),
                t.moveTo(r.median, n),
                t.lineTo(r.median, n + o),
                t.closePath(),
                t.stroke(),
                t.restore(),
                t.save(),
                e.lowerBackgroundColor &&
                    "transparent" !== e.lowerBackgroundColor &&
                    ((t.fillStyle = e.lowerBackgroundColor),
                    r.q3 > r.q1
                        ? t.fillRect(r.median, n, r.q3 - r.median, o)
                        : t.fillRect(r.median, n, r.q1 - r.median, o)),
                t.restore(),
                r.q3 > r.q1
                    ? t.strokeRect(r.q1, n, r.q3 - r.q1, o)
                    : t.strokeRect(r.q3, n, r.q1 - r.q3, o),
                t.beginPath(),
                t.moveTo(r.whiskerMin, n),
                t.lineTo(r.whiskerMin, n + o),
                t.moveTo(r.whiskerMin, i),
                t.lineTo(r.q1, i),
                t.moveTo(r.whiskerMax, n),
                t.lineTo(r.whiskerMax, n + o),
                t.moveTo(r.whiskerMax, i),
                t.lineTo(r.q3, i),
                t.closePath(),
                t.stroke();
        }
        _getBounds(t) {
            const e = this.isVertical();
            if (null == this.x) return { left: 0, top: 0, right: 0, bottom: 0 };
            if (e) {
                const {
                        x: e,
                        width: r,
                        whiskerMax: i,
                        whiskerMin: o
                    } = this.getProps(
                        ["x", "width", "whiskerMin", "whiskerMax"],
                        t
                    ),
                    n = e - r / 2;
                return { left: n, top: i, right: n + r, bottom: o };
            }
            const {
                    y: r,
                    height: i,
                    whiskerMax: o,
                    whiskerMin: n
                } = this.getProps(
                    ["y", "height", "whiskerMin", "whiskerMax"],
                    t
                ),
                s = r - i / 2;
            return { left: n, top: s, right: o, bottom: s + i };
        }
    }
    (R.id = "boxandwhiskers"),
        (R.defaults = {
            ...e.BarElement.defaults,
            ...B,
            medianColor: "transparent",
            lowerBackgroundColor: "transparent"
        }),
        (R.defaultRoutes = { ...e.BarElement.defaultRoutes, ...S });
    class E extends T {
        draw(t) {
            t.save(),
                (t.fillStyle = this.options.backgroundColor),
                (t.strokeStyle = this.options.borderColor),
                (t.lineWidth = this.options.borderWidth);
            const e = this.getProps([
                "x",
                "y",
                "median",
                "width",
                "height",
                "min",
                "max",
                "coords",
                "maxEstimate"
            ]);
            null != e.median &&
                r.drawPoint(
                    t,
                    {
                        pointStyle: "rectRot",
                        radius: 5,
                        borderWidth: this.options.borderWidth
                    },
                    e.x,
                    e.y
                ),
                e.coords && e.coords.length > 0 && this._drawCoords(t, e),
                this._drawOutliers(t),
                this._drawMeanDot(t),
                t.restore(),
                this._drawItems(t);
        }
        _drawCoords(t, e) {
            let r;
            if (
                ((r =
                    null == e.maxEstimate
                        ? e.coords.reduce(
                              (t, e) => Math.max(t, e.estimate),
                              Number.NEGATIVE_INFINITY
                          )
                        : e.maxEstimate),
                this.isVertical())
            ) {
                const { x: i, width: o } = e,
                    n = o / 2 / r;
                t.moveTo(i, e.min),
                    e.coords.forEach((e) => {
                        t.lineTo(i - e.estimate * n, e.v);
                    }),
                    t.lineTo(i, e.max),
                    t.moveTo(i, e.min),
                    e.coords.forEach((e) => {
                        t.lineTo(i + e.estimate * n, e.v);
                    }),
                    t.lineTo(i, e.max);
            } else {
                const { y: i, height: o } = e,
                    n = o / 2 / r;
                t.moveTo(e.min, i),
                    e.coords.forEach((e) => {
                        t.lineTo(e.v, i - e.estimate * n);
                    }),
                    t.lineTo(e.max, i),
                    t.moveTo(e.min, i),
                    e.coords.forEach((e) => {
                        t.lineTo(e.v, i + e.estimate * n);
                    }),
                    t.lineTo(e.max, i);
            }
            t.closePath(), t.stroke(), t.fill();
        }
        _getBounds(t) {
            if (this.isVertical()) {
                const {
                        x: e,
                        width: r,
                        min: i,
                        max: o
                    } = this.getProps(["x", "width", "min", "max"], t),
                    n = e - r / 2;
                return { left: n, top: o, right: n + r, bottom: i };
            }
            const {
                    y: e,
                    height: r,
                    min: i,
                    max: o
                } = this.getProps(["y", "height", "min", "max"], t),
                n = e - r / 2;
            return { left: i, top: n, right: o, bottom: n + r };
        }
    }
    function I(t, r, i, o = [], n = []) {
        e.registry.addControllers(i),
            Array.isArray(o)
                ? e.registry.addElements(...o)
                : e.registry.addElements(o),
            Array.isArray(n)
                ? e.registry.addScales(...n)
                : e.registry.addScales(n);
        const s = r;
        return (s.type = t), s;
    }
    (E.id = "violin"),
        (E.defaults = { ...e.BarElement.defaults, ...B }),
        (E.defaultRoutes = { ...e.BarElement.defaultRoutes, ...S });
    class W extends _ {
        _parseStats(t, e) {
            return b(t, e);
        }
        _transformStats(t, e, r) {
            super._transformStats(t, e, r);
            for (const i of ["whiskerMin", "whiskerMax"]) t[i] = r(e[i]);
        }
    }
    (W.id = "boxplot"),
        (W.defaults = r.merge({}, [
            e.BarController.defaults,
            v(A),
            {
                animations: {
                    numbers: {
                        type: "number",
                        properties:
                            e.BarController.defaults.animations.numbers.properties.concat(
                                [
                                    "q1",
                                    "q3",
                                    "min",
                                    "max",
                                    "median",
                                    "whiskerMin",
                                    "whiskerMax",
                                    "mean"
                                ],
                                A.filter((t) => !t.endsWith("Color"))
                            )
                    }
                },
                dataElementType: R.id
            }
        ])),
        (W.overrides = r.merge({}, [e.BarController.overrides, N()]));
    class V extends e.Chart {
        constructor(t, r) {
            super(t, I("boxplot", r, W, R, [e.LinearScale, e.CategoryScale]));
        }
    }
    V.id = W.id;
    class O extends _ {
        _parseStats(t, e) {
            return w(t, e);
        }
        _transformStats(t, e, r) {
            super._transformStats(t, e, r),
                (t.maxEstimate = e.maxEstimate),
                Array.isArray(e.coords) &&
                    (t.coords = e.coords.map((t) => ({ ...t, v: r(t.v) })));
        }
    }
    (O.id = "violin"),
        (O.defaults = r.merge({}, [
            e.BarController.defaults,
            v(P),
            {
                points: 100,
                animations: {
                    numbers: {
                        type: "number",
                        properties:
                            e.BarController.defaults.animations.numbers.properties.concat(
                                [
                                    "q1",
                                    "q3",
                                    "min",
                                    "max",
                                    "median",
                                    "maxEstimate"
                                ],
                                P.filter((t) => !t.endsWith("Color"))
                            )
                    },
                    kdeCoords: {
                        fn: function (t, e, r) {
                            return Array.isArray(t) && Array.isArray(e)
                                ? e.map((e, i) => ({
                                      v: q.number(t[i] ? t[i].v : null, e.v, r),
                                      estimate: q.number(
                                          t[i] ? t[i].estimate : null,
                                          e.estimate,
                                          r
                                      )
                                  }))
                                : e;
                        },
                        properties: ["coords"]
                    }
                },
                dataElementType: E.id
            }
        ])),
        (O.overrides = r.merge({}, [e.BarController.overrides, N()]));
    class H extends e.Chart {
        constructor(t, r) {
            super(t, I("violin", r, O, E, [e.LinearScale, e.CategoryScale]));
        }
    }
    (H.id = O.id),
        e.registry.addControllers(W, O),
        e.registry.addElements(R, E),
        (t.BoxAndWiskers = R),
        (t.BoxPlotChart = V),
        (t.BoxPlotController = W),
        (t.StatsBase = T),
        (t.Violin = E),
        (t.ViolinChart = H),
        (t.ViolinController = O),
        Object.defineProperty(t, "__esModule", { value: !0 });
});
//# sourceMappingURL=index.umd.min.js.map
