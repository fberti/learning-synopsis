/* csak teszthez: a View-példányok elérhetők window.__views-ben */
(function () { const V = GraphKit.View; GraphKit.View = class extends V { constructor(p, o) { super(p, o); (window.__views = window.__views || []).push(this); } }; })();
