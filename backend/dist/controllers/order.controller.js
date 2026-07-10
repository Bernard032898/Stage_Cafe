"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = getAllOrders;
exports.createOrder = createOrder;
exports.createMultipleOrders = createMultipleOrders;
exports.completeOrder = completeOrder;
exports.cancelOrder = cancelOrder;
exports.getTables = getTables;
exports.getIncome = getIncome;
exports.getTopProducts = getTopProducts;
const orderService = __importStar(require("../services/order.service"));
async function getAllOrders(req, res) {
    const orders = await orderService.getOrders();
    res.json(orders);
}
async function createOrder(req, res) {
    const userId = req.user?.userId;
    const body = req.body;
    if (!userId) {
        return res.status(401).json({
            message: "User authentication required"
        });
    }
    if (!body.tableId && body.tableNumber == null) {
        return res.status(400).json({
            message: "tableId or tableNumber is required"
        });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({
            message: "items is required and must be a non-empty array"
        });
    }
    try {
        const order = await orderService.createOrder({
            userId,
            tableId: body.tableId,
            tableNumber: body.tableNumber,
            items: body.items
        });
        return res.status(201).json(order);
    }
    catch (error) {
        console.error("Create order failed:", error);
        return res.status(400).json({
            message: error?.message || "Unable to create order"
        });
    }
}
async function createMultipleOrders(req, res) {
    const userId = req.user?.userId;
    const body = req.body;
    if (!userId) {
        return res.status(401).json({ message: "User authentication required" });
    }
    if (!Array.isArray(body.orders) || body.orders.length === 0) {
        return res.status(400).json({ message: "orders is required and must be a non-empty array" });
    }
    try {
        const orders = await orderService.createMultipleOrders({ userId, orders: body.orders });
        return res.status(201).json(orders);
    }
    catch (error) {
        console.error("Create multiple orders failed:", error);
        return res.status(400).json({ message: error?.message || "Unable to create orders" });
    }
}
async function completeOrder(req, res) {
    const idValue = req.params.id;
    const id = Array.isArray(idValue) ? idValue[0] : idValue;
    if (!id)
        return res.status(400).json({ message: "Order id required" });
    try {
        const order = await orderService.markOrderComplete(id);
        return res.json(order);
    }
    catch (err) {
        console.error("Complete order failed:", err);
        return res.status(400).json({ message: err?.message || "Unable to complete order" });
    }
}
async function cancelOrder(req, res) {
    const idValue = req.params.id;
    const id = Array.isArray(idValue) ? idValue[0] : idValue;
    if (!id)
        return res.status(400).json({ message: "Order id required" });
    try {
        const order = await orderService.cancelOrder(id);
        return res.json(order);
    }
    catch (err) {
        console.error("Cancel order failed:", err);
        return res.status(400).json({ message: err?.message || "Unable to cancel order" });
    }
}
async function getTables(req, res) {
    try {
        const tables = await orderService.getCafeTables();
        return res.json(tables);
    }
    catch (err) {
        console.error("Get tables failed:", err);
        return res.status(400).json({ message: err?.message || "Unable to get tables" });
    }
}
async function getIncome(req, res) {
    const periodValue = req.query.period;
    let period = "day";
    if (typeof periodValue === "string") {
        period = periodValue;
    }
    else if (Array.isArray(periodValue) && typeof periodValue[0] === "string") {
        period = periodValue[0];
    }
    if (!["day", "month", "year"].includes(period)) {
        return res.status(400).json({ message: "Invalid period, expected day|month|year" });
    }
    try {
        const stats = await orderService.getIncome(period);
        return res.json(stats);
    }
    catch (err) {
        console.error("Get income failed:", err);
        return res.status(400).json({ message: err?.message || "Unable to get income" });
    }
}
async function getTopProducts(req, res) {
    const periodValue = req.query.period;
    let period = "day";
    if (typeof periodValue === "string") {
        period = periodValue;
    }
    else if (Array.isArray(periodValue) && typeof periodValue[0] === "string") {
        period = periodValue[0];
    }
    if (!["day", "month", "year"].includes(period)) {
        return res.status(400).json({ message: "Invalid period, expected day|month|year" });
    }
    try {
        const stats = await orderService.getTopProducts(period);
        return res.json(stats);
    }
    catch (err) {
        console.error("Get top products failed:", err);
        return res.status(400).json({ message: err?.message || "Unable to get top products" });
    }
}
//# sourceMappingURL=order.controller.js.map