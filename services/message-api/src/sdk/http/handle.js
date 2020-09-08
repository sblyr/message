const executionTime = require("execution-time");

module.exports = ({ createContext }) => handler => async (req, res) => {
    const perf = executionTime();
    perf.start();
    const createMeta = () => ({
        perf: perf.stop().time
    });
    let ctx = null;

    try {
        ctx = await createContext();

        req.ctx = ctx;
        ctx.req = req

        let args = null;
        if (req.method === "POST") {
            args = req.body;
        }
        if (req.method === "GET") {
            args = req.params;
        }

        const data = await handler(ctx)(args);

        res.send({
            status: "success",
            meta: createMeta(),
            data
        });
    } catch (e) {
        console.log(e);
        res.send({
            status: "error",
            meta: createMeta(),
            message: e.message
        });
    } finally {
        if (ctx) {
            await ctx.destroy();
        }
    }
};
