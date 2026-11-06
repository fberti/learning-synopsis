import numpy as np
from sna_utils import load_project, check_matrix, ASNR
LECKE = {"Baker_Journals":"12","Borgatti_Camp92":"2","Borgatti_Cities":"6","Borgatti_Scientists504":"7","Burkhardt_GovernmentAgency":"5",
 "Davis_SouthernWomen":"2, 13","Freeman_EIES":"16","Greenacre_DoctoratesByYearAndField":"6","Hawthorne_BankWiring":"2, 11","Kapferer_TailorShop":"11",
 "Knecht_Class12b":"16","Krackhardt_HighTech":"7, 10, 15","Mainas_Terro":"14","Newcomb_Fraternity":"15","Padgett_FlorentineFamilies":"0, 9, 15",
 "Pane_Training":"16","Sampson_Monastery":"12","Savage_TransactionFlows":"7","Schwimmer_PapuanVillage":"12","Wolfe_Primates":"7","Zachary_KarateClub":"11"}
BOOK = {"Borgatti_Cities":"Johnson CitiesUS","Knecht_Class12b":"Knecht Class12h","Savage_TransactionFlows":"Savage TradePre29","Greenacre_DoctoratesByYearAndField":"Greenacre Doctorates"}
def fmt(v):
    v=[x for x in v]
    if v==[0.0,1.0]: return "0/1"
    s=[(str(int(x)) if float(x).is_integer() else str(x).replace('.',',')) for x in v]
    return ("; ".join(s[:4])+(" …" if len(s)>4 else ""))
rows=[]
for d in sorted(ASNR.iterdir()):
    if d.name.startswith(("ASNR_Fig","MAT_")): continue
    p=load_project(d.name)
    nets=p.networks
    shapes=sorted({f"{M.shape[0]}×{M.shape[1]}" for M in nets.values()})
    names=list(nets)
    if d.name=="Greenacre_DoctoratesByYearAndField": names=["(egyetlen táblázat)"]
    netdesc=(", ".join(names) if len(names)<=3 else f"{len(names)} háló ({names[0]} … {names[-1]})")
    sym=[check_matrix(M).get("szimmetrikus") for M in nets.values()]
    mode="kétmódú" if any(M.shape[0]!=M.shape[1] for M in nets.values()) or d.name.startswith("Greenacre") else ("irányítatlan" if all(sym) else ("irányított" if not any(sym) else "vegyes"))
    vals=sorted({x for M in nets.values() for x in check_matrix(M)["értékek"]})
    att="–" if p.attributes is None else f"{p.attributes.shape[1]}"
    nm=d.name+("" if d.name not in BOOK else f"<br><small class='muted'>könyvben: {BOOK[d.name]}</small>")
    rows.append(f"<tr><td><code>{d.name}</code>{'' if d.name not in BOOK else '<br><small class=\"muted\">könyvben: '+BOOK[d.name]+'</small>'}</td><td>{netdesc}</td><td>{', '.join(shapes)}</td><td>{mode}</td><td>{fmt(vals)}</td><td>{att}</td><td>{LECKE.get(d.name,'–')}</td></tr>")
print("\n".join(rows)); print(len(rows))
