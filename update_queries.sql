UPDATE lctoconsumo C SET C.ocupantes =  ? , c.IDENTIFICACAO =  ?  WHERE C.idlocalconsumo =  ?

param0 = integer, "1"
param1 = varchar(100), "*CHOPP CANECA 400ML"
param2 = integer, "17"

---

UPDATE RESMESA C SET C.OBSERVACAO =  ?  WHERE C.DESCRICAO =  ?

param0 = varchar(50), "22"
param1 = varchar(10), "17"


---

INSERT INTO LCTOCONSUMO(IDLOCALCONSUMO, USUARIO, IDPRODUTO, QTDE, OBSERVACAO, OCUPANTES, SABORES, IDENTIFICACAO, VALORUNITARIO, MEIAPORCAO, IDENTIFICACAOMESA) VALUES( ? ,  ? ,  ? , ? ,  ? ,  ? ,  ? ,  ? ,  ? ,  ? ,  ? )


param0 = integer, "17"
param1 = varchar(30), "blu70"
param2 = integer, "602389"
param3 = bigint(*, -2), "1.00"
param4 = varchar(200), ""
param5 = integer, "1"
param6 = varchar(200), ""
param7 = varchar(100), "*CHOPP CANECA 400ML"
param8 = bigint(*, -2), "1.75"
param9 = char(1), "N"
param10 = varchar(8), "22"