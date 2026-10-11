p='c13_exp.py'; s=open(p).read()
a=s.index("class GATLayer(nn.Module):"); b=s.index("class GAT(nn.Module):")
new='''class GATLayer(nn.Module):
    """Ritka (éllistás) GAT-réteg; ei = (forrás, cél) élindexek, önhurokkal."""
    def __init__(s, din, dout, heads, concat=True, drop=0.6):
        super().__init__()
        s.W = nn.Linear(din, dout * heads, bias=False)
        s.a_src = nn.Parameter(torch.empty(heads, dout))
        s.a_dst = nn.Parameter(torch.empty(heads, dout))
        nn.init.xavier_uniform_(s.a_src); nn.init.xavier_uniform_(s.a_dst)
        s.bias = nn.Parameter(torch.zeros(dout * heads if concat else dout))
        s.h, s.d, s.concat, s.drop = heads, dout, concat, drop

    def forward(s, X, ei):
        src, dst = ei
        n = X.shape[0]
        Wh = s.W(X).view(n, s.h, s.d)
        es = (Wh * s.a_src).sum(-1); ed = (Wh * s.a_dst).sum(-1)
        e = F.leaky_relu(es[src] + ed[dst], 0.2)
        emax = torch.full((n, s.h), -1e30).scatter_reduce(0, dst[:, None].expand(-1, s.h), e, "amax")
        w = torch.exp(e - emax[dst])
        den = torch.zeros(n, s.h).index_add_(0, dst, w)
        a = F.dropout(w / den[dst], s.drop, s.training)
        out = torch.zeros(n, s.h, s.d).index_add_(0, dst, a[:, :, None] * Wh[src])
        out = out.reshape(n, -1) if s.concat else out.mean(1)
        return out + s.bias


'''
s=s[:a]+new+s[b:]
s=s.replace("    mask = (A + torch.eye(n)) > 0\n","    ei = (A + torch.eye(n)).nonzero().T\n    mask = (ei[1], ei[0])\n")
s=s.replace("min(accs), max(accs)))","min(accs), max(accs)), flush=True)")
s=s.replace("(Z.argmax(1)[te] == Y[te]).float().mean().item())","(Z.argmax(1)[te] == Y[te]).float().mean().item(), flush=True)")
open(p,'w').write(s)
