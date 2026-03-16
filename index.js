import { getContext } from "../../extensions.js";
import { eventSource, event_types } from "../../script.js";

// 插件标识名
const extensionName = "st_time_perception";

/**
 * 获取格式化后的当前时间字符串
 */
function getCurrentTimeInfo() {
    const now = new Date();
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    let timeSlot = "";
    if (hours >= 0 && hours < 6) timeSlot = "凌晨";
    else if (hours >= 6 && hours < 11) timeSlot = "上午";
    else if (hours >= 11 && hours < 13) timeSlot = "中午";
    else if (hours >= 13 && hours < 18) timeSlot = "下午";
    else if (hours >= 18 && hours < 24) timeSlot = "晚上";

    // 【关键修改】：强化提示词的语气，加入 OOC 绝对指令
    return `\n[OOC重要指令：当前的绝对现实时间是 ${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日, ${days[now.getDay()]}, ${timeSlot} ${hours}:${minutes}。在接下来的回复中，如果用户询问现在几点、向你进行早中晚问候、或讨论现实生活，你必须【严格遵从并说出】这个现实时间，绝对不要使用角色卡或虚拟背景中的时间！]\n`;
}

/**
 * 每次 AI 生成回复前触发，更新时间注入
 */
function injectTimePerception() {
    const timeString = getCurrentTimeInfo();
    const context = getContext();
    
    // 将时间信息注入到酒馆的扩展提示词对象中
    // 这会在发送给 API 时自动拼接到 System Prompt 的末尾
    if (context && context.extensionPrompts) {
        context.extensionPrompts[extensionName] = timeString;
        console.log(`[Time Perception] 已注入时间: ${timeString}`);
    }
}

// 插件初始化入口
jQuery(async () => {
    // 监听：当生成开始时，执行时间注入逻辑
    eventSource.on(event_types.GENERATION_STARTED, injectTimePerception);
    
    console.log("[Time Perception] 扩展加载成功！AI 现在拥有了现实时间感知能力。");
});

