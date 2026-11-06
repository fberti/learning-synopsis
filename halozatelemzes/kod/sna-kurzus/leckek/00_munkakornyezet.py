import marimo

__generated_with = "0.25.2"
app = marimo.App()


@app.cell
def _():
    import networkx as nx
    from sna_utils import load_project, check_matrix, to_networkx
    return check_matrix, load_project, nx, to_networkx


@app.cell
def _(check_matrix, load_project):
    p = load_project("Padgett_FlorentineFamilies")
    check_matrix(p.networks["Marriage"])
    return (p,)


@app.cell
def _(p, to_networkx):
    G = to_networkx(p.networks["Marriage"])
    G.number_of_nodes(), G.number_of_edges(), G.degree["MEDICI"]
    return (G,)


@app.cell
def _(G, nx):
    # A Medici-szám az ASNR 9.3.4 konvenciójával: az elérhetetlen csúcs
    # távolsága = a legnagyobb megfigyelt távolság + 1.
    d = nx.single_source_shortest_path_length(G, "MEDICI")
    legtavolabb = max(max(t.values()) for _, t in nx.all_pairs_shortest_path_length(G))
    farness = sum(d.get(v, legtavolabb + 1) for v in G if v != "MEDICI")
    (G.number_of_nodes() - 1) / farness
    return


if __name__ == "__main__":
    app.run()
