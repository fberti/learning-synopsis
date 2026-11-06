"""A betöltött adatok ellenőrzése a könyvben kinyomtatott számokon."""
import pytest

from sna_utils import load_project, check_matrix, to_networkx


def test_padgett_marriage():
    p = load_project("Padgett_FlorentineFamilies")
    M = p.networks["Marriage"]
    rep = check_matrix(M)
    assert rep["méret"] == (16, 16)
    assert rep["szimmetrikus"] and rep["átló összege"] == 0
    G = to_networkx(M)
    assert G.number_of_nodes() == 16          # a Pucci is benne van!
    assert G.number_of_edges() == 20
    assert G.degree["MEDICI"] == 6            # ASNR 9.3.4: „egy lépésre hat családtól”


def test_wolfe_kinship_is_not_symmetric():
    p = load_project("Wolfe_Primates")
    K = p.networks["Kinship"]
    assert not check_matrix(K)["szimmetrikus"]       # a metaadat szerint irányítatlan!
    assert to_networkx(K).number_of_edges() == 15    # irányított: 15 nyíl


def test_two_mode_is_refused():
    M = load_project("Davis_SouthernWomen").networks["Attendance"]
    assert M.shape == (18, 14) and M.to_numpy().sum() == 89
    with pytest.raises(ValueError):
        to_networkx(M)


def test_knecht_missing_codes():
    p = load_project("Knecht_Class12b")
    assert 9 in check_matrix(p.networks["FriendshipT2"])["értékek"]   # 9 = hiányzó!
