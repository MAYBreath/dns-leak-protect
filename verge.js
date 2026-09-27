// 动态规则智能注入脚本
function main(config) {
  // 1. 智能寻找最合适的主代理策略组
  let targetGroup = "GLOBAL";
  if (config["proxy-groups"] && config["proxy-groups"].length > 0) {
    // 优先匹配各大机场最常见的主策略组名称
    const commonNames = ["Proxy", "PROXIES", "节点选择", "手动选择", "手动切换", "🚀 节点选择"];
    let mainGroup = config["proxy-groups"].find(g => commonNames.includes(g.name));

    // 如果找不到常见名称，兜底找第一个包含节点的 select 组
    if (!mainGroup) {
      mainGroup = config["proxy-groups"].find(g => g.type === "select" && g.proxies && g.proxies.length > 0);
    }

    if (mainGroup) {
      targetGroup = mainGroup.name;
    }
  }

  // 2. ⚡ 在这里添加你需要强制代理且防止 DNS 泄露的域名 ⚡
  const forceProxyDomains = [
    "ip.net.coffee",
    "claude.ai"          // 已为你新增 Claude
    // 如果有新的，继续在这里加，例如：
    // "openai.com", 
  ];

  // 3. 自动构造规则 (统一使用 DOMAIN-SUFFIX 并附加 no-resolve)
  const customRules = forceProxyDomains.map(
    domain => `DOMAIN-SUFFIX,${domain},${targetGroup},no-resolve`
  );

  // 4. 将生成的规则无缝插入到配置规则列表的最顶部
  if (!config.rules) {
    config.rules = [];
  }
  config.rules = [...customRules, ...config.rules];

  return config;
}
