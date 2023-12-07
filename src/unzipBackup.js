fs = require("fs")
AdmZip = require("adm-zip")
readline = require("readline")
mysql = require("mysql2/promise")
turf = require("@turf/turf")

codes = {
	"10": "ADTYL",
	"20": "AIL",
	"40": "AKNL",
	"50": "AML",
	"60": "APIL",
	"70": "APIL",
	"75": "APIL",
	"80": "APIL",
	"90": "APML",
	"100": "APML",
	"105": "APML",
	"110": "APML",
	"120": "APP",
	"130": "AVL",
	"140": "BHL",
	"145": "CLKL",
	"150": "CCIL",
	"160": "CCL",
	"170": "CHBVL",
	"180": "DD111CHL",
	"190": "CKLQL",
	"195": "CKWL",
	"200": "CKWSL",
	"210": "CLKQL",
	"220": "CPTL",
	"230": "DD137CSKL",
	"240": "DD78CUL",
	"250": "DD104CUL",
	"255": "DD104CYL",
	"260": "DD100TKCUPL",
	"270": "DD124CUTL",
	"280": "CWIL",
	"290": "CWL",
	"300": "CWML",
	"310": "CWVL",
	"320": "DDCC",
	"330": "DD1LM",
	"340": "DD1MW",
	"350": "DD1PT",
	"360": "DD1TC",
	"370": "DD2CC",
	"380": "DD2LM",
	"390": "DD2MW",
	"400": "DD2PT",
	"410": "DD2TC",
	"420": "DD3CC",
	"430": "DD3LM",
	"440": "DD3MW",
	"450": "DD3PT",
	"460": "DD3TC",
	"470": "DD4LM",
	"480": "DD4MW",
	"490": "DD4PT",
	"500": "DD4TC",
	"510": "DD5",
	"514": "DD5TLL",
	"515": "DD5TLLO",
	"520": "DD5LM",
	"530": "DD5PT",
	"540": "DD5TC",
	"550": "DD6",
	"554": "DD6TLL",
	"555": "DD6TLLO",
	"560": "DD6LM",
	"570": "DD6PT",
	"580": "DD6TC",
	"590": "DD7",
	"594": "DD7TLL",
	"595": "DD7TLLO",
	"600": "DD7LM",
	"610": "DD8",
	"620": "DD8LM",
	"630": "DD9",
	"634": "DD9TLL",
	"635": "DD9TLLO",
	"640": "DD9LM",
	"650": "DD10",
	"654": "DD10TLL",
	"655": "DD10TLLO",
	"660": "DD10LM",
	"670": "DD11",
	"674": "DD11TLL",
	"675": "DD11TLLO",
	"680": "DD12",
	"690": "DD13",
	"700": "DD14",
	"710": "DD15",
	"720": "DD16",
	"724": "DD16TLL",
	"725": "DD16TLLO",
	"730": "DD17",
	"740": "DD18",
	"750": "DD19",
	"754": "DD19TLL",
	"755": "DD19TLLO",
	"760": "DD20",
	"770": "DD21",
	"774": "DD21TLL",
	"775": "DD21TLLO",
	"780": "DD22",
	"790": "DD23",
	"800": "DD24",
	"810": "DD25",
	"820": "DD26",
	"824": "DD26TLL",
	"825": "DD26TLLO",
	"830": "DD27",
	"840": "DD28",
	"844": "DD28TLL",
	"845": "DD28TLLO",
	"850": "DD29",
	"854": "DD29TLL",
	"855": "DD29TLLO",
	"860": "DD30",
	"870": "DD31",
	"880": "DD32",
	"884": "DD32TLL",
	"885": "DD32TLLO",
	"890": "DD33",
	"900": "DD34",
	"904": "DD34TLL",
	"905": "DD34TLLO",
	"910": "DD35",
	"914": "DD35TLL",
	"915": "DD35TLLO",
	"920": "DD36",
	"924": "DD36TLL",
	"925": "DD36TLLO",
	"930": "DD36A",
	"940": "DD37",
	"944": "DD37TLL",
	"945": "DD37TLLO",
	"950": "DD38",
	"960": "DD38A",
	"970": "DD39",
	"974": "DD39TLL",
	"975": "DD39TLLO",
	"980": "DD40",
	"984": "DD40TLL",
	"985": "DD40TLLO",
	"990": "DD41",
	"994": "DD41TLL",
	"995": "DD41TLLO",
	"1000": "DD42",
	"1005": "DD42TLLO",
	"1010": "DD43",
	"1020": "DD44",
	"1024": "DD44TLL",
	"1025": "DD44TLLO",
	"1030": "DD45",
	"1040": "DD46",
	"1050": "DD47",
	"1054": "DD47TLL",
	"1055": "DD47TLLO",
	"1060": "DD48",
	"1070": "DD49",
	"1080": "DD50",
	"1084": "DD50TLL",
	"1085": "DD50TLLO",
	"1090": "DD51",
	"1094": "DD51TLL",
	"1095": "DD51TLLO",
	"1100": "DD52",
	"1104": "DD52TLL",
	"1105": "DD52TLLO",
	"1110": "DD53",
	"1120": "DD54",
	"1124": "DD54TLL",
	"1125": "DD54TLLO",
	"1130": "DD55",
	"1140": "DD56",
	"1144": "DD56TLL",
	"1145": "DD56TLLO",
	"1150": "DD57",
	"1160": "DD58",
	"1170": "DD59",
	"1180": "DD60",
	"1184": "DD61",
	"1190": "DD62",
	"1200": "DD63",
	"1204": "DD63TLL",
	"1205": "DD63TLLO",
	"1210": "DD64",
	"1220": "DD65",
	"1224": "DD65TLL",
	"1225": "DD65TLLO",
	"1230": "DD66",
	"1234": "DD66TLL",
	"1235": "DD66TLLO",
	"1238": "DD67",
	"1240": "DD68",
	"1250": "DD69",
	"1260": "DD70",
	"1270": "DD71",
	"1280": "DD72",
	"1290": "DD73",
	"1294": "DD73TLL",
	"1295": "DD73TLLO",
	"1300": "DD74",
	"1304": "DD74TLL",
	"1305": "DD74TLLO",
	"1310": "DD75",
	"1314": "DD75TLL",
	"1315": "DD75TLLO",
	"1320": "DD76",
	"1324": "DD76TLL",
	"1325": "DD76TLLO",
	"1330": "DD77",
	"1334": "DD77TLL",
	"1335": "DD77TLLO",
	"1340": "DD78",
	"1350": "DD79",
	"1360": "DD80",
	"1370": "DD81",
	"1374": "DD81TLL",
	"1375": "DD81TLLO",
	"1380": "DD82",
	"1384": "DD82TLL",
	"1385": "DD82TLLO",
	"1390": "DD83",
	"1394": "DD83TLL",
	"1395": "DD83TLLO",
	"1400": "DD84",
	"1410": "DD85",
	"1420": "DD86",
	"1430": "DD87",
	"1440": "DD88",
	"1450": "DD89",
	"1454": "DD89TLL",
	"1455": "DD89TLLO",
	"1460": "DD90",
	"1464": "DD90TLL",
	"1465": "DD90TLLO",
	"1470": "DD91",
	"1474": "DD91TLL",
	"1475": "DD91TLLO",
	"1480": "DD92",
	"1490": "DD93",
	"1494": "DD93TLL",
	"1495": "DD93TLLO",
	"1500": "DD94",
	"1510": "DD95",
	"1514": "DD95TLL",
	"1515": "DD95TLLO",
	"1520": "DD96",
	"1524": "DD96TLL",
	"1525": "DD96TLLO",
	"1530": "DD97",
	"1540": "DD98",
	"1550": "DD99",
	"1560": "DD100",
	"1570": "DD101",
	"1580": "DD102",
	"1590": "DD103",
	"1600": "DD104",
	"1610": "DD105",
	"1620": "DD106",
	"1630": "DD107",
	"1640": "DD108",
	"1650": "DD109",
	"1660": "DD110",
	"1670": "DD111",
	"1674": "DD111TLL",
	"1675": "DD111TLLO",
	"1680": "DD112",
	"1690": "DD113",
	"1700": "DD114",
	"1710": "DD115",
	"1714": "DD115TLL",
	"1715": "DD115TLLO",
	"1720": "DD116",
	"1730": "DD117",
	"1734": "DD117TLL",
	"1735": "DD117TLLO",
	"1740": "DD118",
	"1750": "DD119",
	"1760": "DD120",
	"1770": "DD121",
	"1780": "DD122",
	"1790": "DD123",
	"1800": "DD124",
	"1810": "DD125",
	"1820": "DD126",
	"1830": "DD127",
	"1840": "DD128",
	"1850": "DD129",
	"1860": "DD130",
	"1870": "DD131",
	"1880": "DD132",
	"1890": "DD133",
	"1900": "DD134",
	"1910": "DD135",
	"1920": "DD136",
	"1930": "DD137",
	"1940": "DD138",
	"1950": "DD139",
	"1960": "DD140",
	"1970": "DD141",
	"1980": "DD142",
	"1990": "DD143",
	"2000": "DD144",
	"2010": "DD145",
	"2015": "DD145TLLO",
	"2020": "DD146",
	"2025": "DD146TLLO",
	"2030": "DD147",
	"2034": "DD147TLL",
	"2035": "DD147TLLO",
	"2040": "DD148",
	"2041": "DD149",
	"2042": "DD150",
	"2043": "DD151",
	"2044": "DD152",
	"2045": "DD153",
	"2046": "DD154",
	"2047": "DD155",
	"2048": "DD156",
	"2050": "DD157",
	"2055": "DD158",
	"2060": "DD159",
	"2070": "DD160",
	"2080": "DD161",
	"2090": "DD162",
	"2100": "DD163",
	"2105": "DD164",
	"2110": "DD165",
	"2115": "DD166",
	"2120": "DD167",
	"2124": "DD167TLL",
	"2125": "DD167TLLO",
	"2128": "DD168",
	"2130": "DD169",
	"2140": "DD170",
	"2150": "DD171",
	"2160": "DD172",
	"2170": "DD173",
	"2180": "DD174",
	"2190": "DD175",
	"2200": "DD176",
	"2210": "DD177",
	"2220": "DD178",
	"2230": "DD179",
	"2240": "DD180",
	"2244": "DD180TLL",
	"2245": "DD180TLLO",
	"2250": "DD181",
	"2260": "DD182",
	"2270": "DD183",
	"2280": "DD184",
	"2290": "DD185",
	"2300": "DD186",
	"2310": "DD187",
	"2320": "DD188",
	"2330": "DD189",
	"2335": "DD189TLLO",
	"2340": "DD190",
	"2350": "DD191",
	"2360": "DD192",
	"2370": "DD193",
	"2380": "DD194",
	"2390": "DD195",
	"2400": "DD196",
	"2410": "DD197",
	"2420": "DD198",
	"2430": "DD199",
	"2440": "DD200",
	"2450": "DD201",
	"2460": "DD202",
	"2470": "DD203",
	"2480": "DD204",
	"2490": "DD205",
	"2500": "DD206",
	"2504": "DD206TLL",
	"2505": "DD206TLLO",
	"2510": "DD207",
	"2520": "DD208",
	"2530": "DD209",
	"2534": "DD209TLL",
	"2535": "DD209TLLO",
	"2540": "DD210",
	"2550": "DD211",
	"2560": "DD212",
	"2570": "DD213",
	"2580": "DD214",
	"2590": "DD215",
	"2594": "DD215TLL",
	"2595": "DD215TLLO",
	"2600": "DD216",
	"2610": "DD217",
	"2620": "DD218",
	"2630": "DD219",
	"2640": "DD220",
	"2650": "DD221",
	"2660": "DD222",
	"2664": "DD222TLL",
	"2665": "DD222TLLO",
	"2670": "DD223",
	"2680": "DD224",
	"2690": "DD225",
	"2700": "DD226",
	"2710": "DD227",
	"2720": "DD228",
	"2730": "DD229",
	"2740": "DD230",
	"2750": "DD231",
	"2760": "DD232",
	"2770": "DD233",
	"2780": "DD234",
	"2790": "DD235",
	"2800": "DD236",
	"2810": "DD237",
	"2820": "DD238",
	"2830": "DD239",
	"2840": "DD240",
	"2850": "DD241",
	"2860": "DD242",
	"2870": "DD243",
	"2880": "DD244",
	"2884": "DD244TLL",
	"2885": "DD244TLLO",
	"2890": "DD245",
	"2900": "DD246",
	"2910": "DD247",
	"2920": "DD248",
	"2930": "DD249",
	"2940": "DD250",
	"2950": "DD251",
	"2960": "DD252",
	"2970": "DD253",
	"2980": "DD254",
	"2990": "DD255",
	"3000": "DD256",
	"3010": "DD257",
	"3020": "DD258",
	"3030": "DD259",
	"3040": "DD260",
	"3050": "DD261",
	"3060": "DD262",
	"3070": "DD263",
	"3080": "DD264",
	"3081": "DD264A",
	"3090": "DD265",
	"3100": "DD266",
	"3110": "DD267",
	"3120": "DD268",
	"3130": "DD269",
	"3140": "DD270",
	"3150": "DD271",
	"3160": "DD272",
	"3170": "DD273",
	"3180": "DD274",
	"3184": "DD274TLL",
	"3185": "DD274TLLO",
	"3190": "DD275",
	"3200": "DD276",
	"3205": "DD277",
	"3210": "DD278",
	"3220": "DD279",
	"3230": "DD280",
	"3240": "DD281",
	"3244": "DD281TLL",
	"3245": "DD281TLLO",
	"3250": "DD282",
	"3260": "DD283",
	"3270": "DD284",
	"3280": "DD285",
	"3290": "DD286",
	"3300": "DD287",
	"3310": "DD288",
	"3320": "DD289",
	"3330": "DD290",
	"3340": "DD291",
	"3350": "DD292",
	"3360": "DD293",
	"3370": "DD294",
	"3380": "DD295",
	"3390": "DD296",
	"3394": "DD296TLL",
	"3395": "DD296TLLO",
	"3400": "DD297",
	"3404": "DD297TLL",
	"3405": "DD297TLLO",
	"3410": "DD298",
	"3420": "DD299",
	"3430": "DD300",
	"3440": "DD301L",
	"3450": "DD302L",
	"3460": "DD303L",
	"3470": "DD304L",
	"3480": "DD305L",
	"3490": "DD306L",
	"3500": "DD307L",
	"3510": "DD308L",
	"3520": "DD309L",
	"3530": "DD310L",
	"3540": "DD311L",
	"3545": "DD312L",
	"3550": "DD313L",
	"3560": "DD314L",
	"3565": "DD315L",
	"3570": "DD316L",
	"3580": "DD317L",
	"3585": "DD318L",
	"3590": "DD319L",
	"3600": "DD320L",
	"3610": "DD321L",
	"3620": "DD322L",
	"3630": "DD323L",
	"3640": "DD324L",
	"3650": "DD325L",
	"3660": "DD326L",
	"3670": "DD327L",
	"3680": "DD328L",
	"3690": "DD329L",
	"3700": "DD330L",
	"3710": "DD331L",
	"3720": "DD332L",
	"3730": "DD333L",
	"3740": "DD334L",
	"3750": "DD335L",
	"3760": "DD336L",
	"3770": "DD337L",
	"3780": "DD338L",
	"3790": "DD339L",
	"3800": "DD340L",
	"3810": "DD341L",
	"3820": "DD342L",
	"3830": "DD343L",
	"3840": "DD344L",
	"3850": "DD345L",
	"3860": "DD346L",
	"3870": "DD347L",
	"3875": "DD348L",
	"3880": "DD349L",
	"3890": "DD350L",
	"3900": "DD351",
	"3910": "DD351L",
	"3920": "DD352",
	"3930": "DD352L",
	"3940": "DD353",
	"3950": "DD353L",
	"3960": "DD354",
	"3970": "DD354L",
	"3980": "DD355",
	"3990": "DD355L",
	"4000": "DD356",
	"4010": "DD356L",
	"4020": "DD357",
	"4030": "DD357L",
	"4040": "DD358",
	"4050": "DD358L",
	"4060": "DD359",
	"4070": "DD359L",
	"4080": "DD360",
	"4090": "DD360L",
	"4100": "DD361",
	"4110": "DD361L",
	"4120": "DD362",
	"4130": "DD362L",
	"4140": "DD363",
	"4150": "DD363L",
	"4160": "DD364",
	"4170": "DD364L",
	"4180": "DD365",
	"4190": "DD366",
	"4200": "DD367",
	"4210": "DD368",
	"4220": "DD369",
	"4230": "DD370",
	"4240": "DD371",
	"4250": "DD372",
	"4260": "DD373",
	"4270": "DD374",
	"4280": "DD375",
	"4290": "DD376",
	"4300": "DD377",
	"4310": "DD378",
	"4320": "DD379",
	"4325": "DD380",
	"4330": "DD381",
	"4335": "DD382",
	"4340": "DD383",
	"4350": "DD384",
	"4360": "DD385",
	"4365": "DD386",
	"4370": "DD387",
	"4380": "DD388",
	"4390": "DD389",
	"4400": "DD390",
	"4410": "DD391",
	"4420": "DD392",
	"4430": "DD393",
	"4440": "DD394",
	"4450": "DD395",
	"4460": "DD396",
	"4470": "DD397",
	"4480": "DD398",
	"4490": "DD399",
	"4500": "DD400",
	"4510": "DD401",
	"4520": "DD431",
	"4530": "DD432",
	"4540": "DD433",
	"4550": "DD434",
	"4560": "DD435",
	"4570": "DD436",
	"4580": "DD437",
	"4590": "DD438",
	"4600": "DD439",
	"4610": "DD440",
	"4620": "DD441",
	"4625": "DD442",
	"4630": "DD443",
	"4640": "DD444",
	"4650": "DD445",
	"4660": "DD446",
	"4670": "DD447",
	"4674": "DD447TLL",
	"4675": "DD447TLLO",
	"4680": "DD448",
	"4690": "DD449",
	"4700": "DD450",
	"4710": "DD451",
	"4715": "DD452",
	"4720": "DD453",
	"4730": "DD454",
	"4740": "DD455",
	"4750": "DD456",
	"4752": "DD457",
	"4754": "DD458",
	"4756": "DD459",
	"4758": "DD460",
	"4760": "DD461",
	"4770": "DD462",
	"4780": "DD463",
	"4790": "DD464",
	"4795": "DD466",
	"4800": "DD352AL",
	"4810": "DDAC",
	"4820": "DDLTP",
	"4825": "DDMCP",
	"4830": "DDMFA",
	"4840": "DDMT",
	"4850": "MAWAN",
	"4860": "DDNP",
	"4870": "DDPC",
	"4880": "DDPC",
	"4885": "DDPT",
	"4890": "DDSAC",
	"4900": "DDSYW",
	"4910": "DDTAC",
	"4920": "DDTTT",
	"4930": "UDWYTL",
	"4935": "DL",
	"4940": "DD137FHLL",
	"4950": "DD128FKTL",
	"4960": "FL",
	"4970": "FL",
	"4980": "DD51FL",
	"4990": "DD51FLL",
	"5000": "FSSTL",
	"5010": "DD121FSWL",
	"5020": "DD82FWWL",
	"5030": "GL",
	"5260": "DD12HHL",
	"5270": "HHIL",
	"5280": "HHML",
	"5290": "HKCL",
	"5300": "HKPP",
	"5301": "HL-YL",
	"5310": "DD76HLL",
	"5320": "DD76HLML",
	"5330": "DD121HMTL",
	"5335": "DD137HCHL",
	"5340": "DD137HNLL",
	"5350": "HPLVL",
	"5360": "DD95HSHL",
	"5365": "HSKTL",
	"5370": "DD100TKHTL",
	"5380": "DD76HTL",
	"5390": "DD111HTL",
	"5400": "DD125HTSL",
	"5410": "DD116HTTL",
	"5415": "DD117HTTL",
	"5420": "DD125HTTTL",
	"5430": "HTVL",
	"5440": "DD80HULYL",
	"5450": "DD78HUSWL",
	"5460": "DD127FUTL",
	"5470": "DD121HYTL",
	"5480": "DD92IKL",
	"5490": "IL",
	"5500": "JBTL",
	"5510": "KCL",
	"5515": "TYL",
	"5520": "KCRCL",
	"5530": "KCTL",
	"5550": "KDFL",
	"5560": "KFL",
	"5570": "KGL",
	"5580": "DD109KHWL",
	"5590": "KIL",
	"5600": "DD114KIL",
	"5610": "KML",
	"5620": "DD103KPL",
	"5630": "KPP",
	"5640": "KPPG",
	"5650": "KPSVL",
	"5660": "DD92KTL",
	"5670": "DD95KTL",
	"5680": "DD83KTL",
	"5690": "DD116KTL",
	"5700": "KTIL",
	"5710": "KTIL",
	"5720": "DD76KTLL",
	"5730": "DD109KTPPL",
	"5740": "DD109KTSL",
	"5750": "DD116KTSTL",
	"5760": "DD129KTTL",
	"5770": "DD82KTWL",
	"5780": "DD127KTWL",
	"5790": "KWC",
	"5800": "DD112LFTL",
	"5810": "DD120LHL",
	"5820": "LHKL",
	"5830": "LHKVL",
	"5840": "DD114LKTL",
	"5850": "DD96LMCL",
	"5855": "LMCIL",
	"5860": "LML",
	"5870": "DD90LMWL",
	"5880": "DD93LPL",
	"5890": "DD85LSHL",
	"5900": "DD82LSLL",
	"5910": "DD130LTL",
	"5920": "DD76LTL",
	"5930": "DD100LTML",
	"5940": "DD137LTTL",
	"5950": "DD82LUTL",
	"5960": "DD125LUTL",
	"5970": "DD124LUTL",
	"5980": "LYQL",
	"5990": "DD83LYTLWL",
	"6000": "DD83LYTMWWL",
	"6010": "DD83LYTSHL",
	"6020": "DD83LYTSUL",
	"6030": "DD83LYTSWL",
	"6040": "DD83TKWL",
	"6050": "DD83LTTTTL",
	"6060": "DD83WNTL",
	"6070": "DD83WNWL",
	"6080": "DD76MKL",
	"6090": "DD119MKTL",
	"6100": "ML",
	"6110": "ML",
	"6125": "DD113MOKL",
	"6130": "DD113MOKL",
	"6140": "DD104MPL",
	"6145": "DD105MPL",
	"6150": "DD120MTL",
	"6160": "MTKQL",
	"6170": "MTLA",
	"6175": "MTRL",
	"6180": "DD129MTWL",
	"6195": "DD118NHL",
	"6200": "DD129NHL",
	"6205": "DD129NHSTL",
	"6210": "DD78PYTML",
	"6220": "NKCL",
	"6230": "NKDFL",
	"6240": "NKFL",
	"6250": "NKIL",
	"6260": "DD108NKKL",
	"6270": "NKML",
	"6280": "NKP",
	"6290": "NKPP",
	"6300": "NKPPG",
	"6310": "NKRBL",
	"6320": "DD115NPWL",
	"6330": "NSWQL",
	"6340": "NTKL",
	"6350": "NTKQL",
	"6360": "DD130NWL",
	"6370": "DD133NWL",
	"6380": "NYCL",
	"6390": "DD6PCL",
	"6400": "PCL",
	"6410": "PDFL",
	"6420": "DD91PKL",
	"6430": "PL",
	"6440": "PL",
	"6450": "DD137PLL",
	"6460": "PP",
	"6470": "PRML",
	"6480": "DD122PSFYL",
	"6490": "DD119PSL",
	"6500": "DD122PSHML",
	"6510": "DD122HMTL",
	"6520": "DD122PSHTL",
	"6530": "PSIL",
	"6540": "DD122PSSL",
	"6550": "DD121PSSTL",
	"6560": "DD119PSTL",
	"6565": "DD121PSTFL",
	"6570": "DD119PSWLL",
	"6580": "DD132PTHL",
	"6590": "DD77PTKTL",
	"6600": "PTL",
	"6610": "DD77PTSWL",
	"6620": "DD77PTTL",
	"6630": "DD77PTUHL",
	"6640": "PVL",
	"6650": "DD104PWL",
	"6660": "DD79PYTL",
	"6680": "QBIL",
	"6690": "QBML",
	"6700": "RBL",
	"6710": "DD120SCTL",
	"6720": "DD122SCWL",
	"6725": "DD122SCWL",
	"6730": "SD1",
	"6740": "SD2",
	"6750": "SD3",
	"6760": "SD4",
	"6770": "SD5",
	"6780": "SD9",
	"6790": "DD130SFWL",
	"6800": "DD131SHL",
	"6810": "DD132SHL",
	"6820": "DD121SHL",
	"6830": "DD121SHTL",
	"6840": "SIIL",
	"6850": "SIL",
	"6860": "SIL",
	"6870": "SIL",
	"6880": "SKIL",
	"6890": "DD6SKLL",
	"6900": "SKML",
	"6910": "DD91SKPL",
	"6920": "DD110SKTL",
	"6930": "DD129SKTL",
	"6940": "DD125SKTL",
	"6950": "SKTL",
	"6960": "DD84SKWL",
	"6970": "DD125SKWL",
	"6980": "DD129SKWL",
	"6990": "DD129SKWTL",
	"7000": "SL",
	"7010": "SL",
	"7020": "DD112SLTL",
	"7030": "SML",
	"7040": "SML",
	"7050": "SML",
	"7055": "DD137SPKL",
	"7060": "DD137SNLL",
	"7070": "SOHL",
	"7080": "SOIL",
	"7090": "SOL",
	"7100": "SOVL",
	"7110": "DD107SPL",
	"7120": "DD115SPL",
	"7130": "DD117SPHSTL",
	"7140": "DD124SPTL",
	"7150": "DD120SPTL",
	"7160": "DD120SPWL",
	"7170": "DD115SPWL",
	"7180": "SQL",
	"7190": "DD52SSL",
	"7200": "SSIL",
	"7210": "SSL",
	"7220": "DD124SSTL",
	"7230": "DD124SSWL",
	"7240": "DD76STCHL",
	"7250": "DD112STL",
	"7260": "DD102STL",
	"7265": "DD117STL",
	"7270": "DD111STL",
	"7280": "SIL",
	"7290": "STL",
	"7300": "DD116LWL",
	"7310": "DD85STPL",
	"7320": "STTL",
	"7330": "STVL",
	"7340": "STWQL",
	"7350": "DD90SULL",
	"7360": "DD91SUTL",
	"7370": "DD125SUTL",
	"7380": "SVL",
	"7390": "DD91SWHL",
	"7400": "DD125SWL",
	"7410": "DD105SFWVL",
	"7420": "DD106SYKL",
	"7425": "TCL",
	"7430": "TBL",
	"7440": "DD76TCHL",
	"7445": "TCTL",
	"7450": "DD130TCWL",
	"7455": "DD118TCWL",
	"7460": "DD82TFL",
	"7470": "DD121TFL",
	"7480": "THIL",
	"7490": "THL",
	"7500": "DD100TKPUL",
	"7510": "THSVL",
	"7520": "DD109THWL",
	"7530": "DD104THWL",
	"7540": "TIML",
	"7550": "TIQL",
	"7560": "DD120TKL",
	"7570": "DD94TKLL",
	"7580": "DD100TKL",
	"7590": "TKOTL",
	"7600": "TKTL",
	"7610": "DD125CKWL",
	"7620": "TL",
	"7630": "DD120TLL",
	"7640": "TLTL",
	"7650": "TLTTL",
	"7660": "TLWVL",
	"7670": "DD137TMCL",
	"7680": "TMIL",
	"7690": "DD130TMSTL",
	"7700": "TMTL",
	"7710": "DD113TPL",
	"7720": "TPIL",
	"7730": "TPIL",
	"7740": "DD92TPLL",
	"7750": "DD6TPOML",
	"7760": "DD84TPTL",
	"7770": "TPTL",
	"7780": "DD5TPTTL",
	"7790": "DD5TPTWL",
	"7800": "TPVL",
	"7810": "DD133TSHL",
	"7820": "DD131TSHKL",
	"7830": "DD131TSL",
	"7840": "DD111TSSLWL",
	"7850": "DD124TSTL",
	"7860": "DD111TSTL",
	"7870": "DD108TSUL",
	"7875": "DD111TSWLLL",
	"7880": "DD111TSWNLL",
	"7890": "TSWTL",
	"7900": "DD96TTL",
	"7910": "DD123TTL",
	"7920": "DD117TTL",
	"7930": "DD116TTPL",
	"7940": "DD115TTTL",
	"7950": "TTVL",
	"7960": "DD130TTWL",
	"7970": "DD132TTWL",
	"7980": "DD115TTYL",
	"7990": "DD78TUHL",
	"8000": "DD95TUL",
	"8010": "DD115TUTL",
	"8020": "TVL",
	"8030": "TVL",
	"8040": "DD115TWL",
	"8050": "TWIL",
	"8060": "TWML",
	"8070": "TWPP",
	"8075": "KTPP",
	"8076": "KTPPL",
	"8080": "TWQL",
	"8090": "DD6TWSL",
	"8100": "TWTA",
	"8110": "DD113TWTL",
	"8120": "TWTL",
	"8130": "TYML",
	"8140": "TYTL",
	"8145": "DD115ULML",
	"8150": "VPP",
	"8160": "VVL",
	"8170": "DD123WCL",
	"8180": "WCHVL",
	"8200": "DD79WKSL",
	"8210": "DD131WKWL",
	"8220": "DD116WLL",
	"8230": "DD109WLWL",
	"8240": "WMKVL",
	"8250": "WNCVL",
	"8260": "DD117WNTL",
	"8270": "DD115WUTL",
	"8280": "DD106YKTL",
	"8290": "DD115YLL",
	"8300": "DD129YLTL",
	"8310": "YLTL",
	"8320": "DD115YLWL",
	"8325": "YOL",
	"8330": "DD131YSHL",
	"8340": "YTIL",
	"8350": "YTML",
	"8360": "DD116YTTL",
	"8370": "DD116YUTL",
	"8400": "OLNGTL"
}
grantTypes = {
	"CTI": "Crown Lease to Colonial Treasury Incorporated",
	"DL": "Defence Lot",
	"EXCH": "Lot to be exchanged",
	"FH": "Freehold",
	"FSI": "Crown Lease to Financial Secretary Incorporated",
	"LL": "Lease Hold",
	"NGL": "New Grant Lot",
	"OSL": "Old Schedule Lot",
	"SAND": "Sandwich Lot",
	"STRA": "Stratum Lot",
	"SUR": "Lot to be surrendered or resumed",
	"TLL": "Taxlord Lot",
	"TLLO": "Taxlord Lot [old]"
}

main()

async function main () {

	allZones = JSON.parse(fs.readFileSync("./all_plans.json").toString())
	allPlansObj = {}
	for (ozp of Object.keys(allZones)) {
		allPlansObj[ozp.split("_")[1]] = ozp
	}

	newZones = JSON.parse(fs.readFileSync("./new_plans.json").toString())
	newPlansObj = {}
	for (ozp of Object.keys(newZones)) {
		newPlansObj[ozp.split("_")[1]] = ozp
	}

	fs.rmSync("../lotdb.github.io/land/lot", { force: true, recursive: true })
	fs.mkdirSync("../lotdb.github.io/land/lot")
	fs.mkdirSync("./downloads")

	const pool = await mysql.createPool({
		host: "localhost",
		user: "root",
		password: "3199!Important",
		database: "database",
		connectionLimit: 1000000000
	})

	unzipAndUpdateFiles(newPlansObj)
	writePlaces(allPlansObj)

	boxes = getBoxes(allPlansObj)
	features = await readStream("../Lot_GEOJSON/LOT.json")
	currLots = features.map(function (feature) {
		return feature.properties.LOTID.toString()
	})
	prevLots = await classifyPrevLots(pool, newPlansObj, currLots)
	if (prevLots.invalid.length > 0) {
		await pool.query("DELETE FROM lot WHERE id IN ('" + prevLots.invalid.join("', '") + "')")
	}
	newFeatures = features.filter(function (feature) {
		return (prevLots.valid.indexOf(feature.properties.LOTID.toString()) == -1)
	})
	promises = []
	count = 1
	for (feature of newFeatures) {
		promise = new Promise(function (resolve) {
			lotID = feature.properties.LOTID.toString()
			lotCSUID = feature.properties.LOTCSUID
			if (feature.geometry.type == "Polygon") {
				coord = [ feature.geometry.coordinates ]
			} else {
				coord = feature.geometry.coordinates ?? [ feature.geometry.rings ]
			}
			lotUses = getLotUses(coord, getZones(coord, boxes))
			console.log(lotID, count)
			count = count + 1
			resolve([
				lotID,
				lotCSUID,
				JSON.stringify(lotUses)
			])
		})
		promises.push(promise)
		if (promises.length % 1000 == 0) {
			rows = await Promise.all(promises)
			await insert(pool, "lot", rows)
			promises = []
		}
	}
	rows = await Promise.all(promises)
	await insert(pool, "lot", rows)

	memorialPRN = await getMemorials()
	await insert(pool, "lot_info", getRowsForCSUID(memorialPRN))

	await writeLots(pool, getLandDocs())

	writeMemorials()

	pool.end()

}

async function classifyPrevLots (pool, newPlansObj, currLots) {
	const [ rows, fields ] = await pool.query("SELECT * FROM lot")
	result = {
		valid: [],
		invalid: []
	}
	for (row of rows) {
		if (currLots.indexOf(row.id) == -1) {
			result.invalid.push(row.id)
			continue
		}
		for (plan of Object.keys(JSON.parse(row.lot_use))) {
			if (newPlansObj[plan]) {
				result.invalid.push(row.id)
				continue
			}
		}
		result.valid.push(row.id)
	}
	return result
}

function compare (boxA, boxB) {
	return (boxA.xMax > boxB.xMin && boxA.xMin < boxB.xMax && boxA.yMax > boxB.yMin && boxA.yMin < boxB.yMax)
}

function getBox (coord) {
	xMin = 900000
	xMax = 700000
	yMin = 900000
	yMax = 700000
	for (a of coord){
		for (b of a) {
			for (c of b) {
				if (xMin > c[0]) { xMin = c[0] }
				if (xMax < c[0]) { xMax = c[0] }
				if (yMin > c[1]) { yMin = c[1] }
				if (yMax < c[1]) { yMax = c[1] }
			}
		}
	}
	return {
		xMin: xMin,
		xMax: xMax,
		yMin: yMin,
		yMax: yMax,
		feature: turf.multiPolygon(coord)
	}
}

function getBoxes (allPlansObj) {
	result = {}
	for (plan in allPlansObj) {
		boundaries = JSON.parse(fs.readFileSync("./boundaries/" + plan + ".json").toString())
		try {
			feature = boundaries.PLAN_SCHEME_AREA.features[0]
		} catch (e) {
			feature = boundaries.features[0]
		}
		if (feature.geometry.type == "Polygon") {
			coord = [ feature.geometry.coordinates ]
		} else {
			coord = feature.geometry.coordinates ?? [ feature.geometry.rings ]
		}
		result[plan] = getBox(coord)
	}
	return result
}

function getFeatureUse (feature) {
	usesAvailable = [ "AGR", "C", "CA", "CDA", "CP", "CPA", "G/IC", "GB", "I", "I(D)", "O", "OS", "OU", "R(A)", "R(B)", "R(C)", "R(D)", "R(E)", "REC", "SSSI", "V", "Z" ]
	try {
		result = feature.attributes.ZONE_LABEL
	} catch (e) {
		result = feature.properties.ZONE_LABEL
	}
	for (i = usesAvailable.length - 1; i >= 0; i--) {
		if (result == usesAvailable[i]) {
			return result
		}
	}
	return "OU"
}

function getLandDocs () {
	landDocs = {}
	readFile("../Lot_GEOJSON/LANDDOCUMENT.json").forEach(function (properties) {
		landDocs[properties.PRN] = [
			properties.GRANTDOCTYPE,
			properties.GRANTDOCNO,
			properties.COMMENCEMENTDATE,
			properties.EXPIRYDATE,
			properties.LEASETERM,
			properties.RENEWABILITY,
			properties.USERTYPE,
			properties.TREEPRESERVATION,
			properties.TYPEOFBLDG,
			properties.BC,
			properties.CTODATE,
			properties.MAXBLDGHT,
			properties.NOOFSTOREYS,
			properties.NOOFUNITSRESTRICTION,
			properties.UNITSIZERESTRICTION,
			properties.DDORDDHCLAUSE,
			properties.SITECOVERAGE,
			properties.MAXGFA,
			properties.MINGFA,
			properties.PUBLICOPENSPACE,
			properties.GOVTACCOM,
			properties.SCAUTHSATISFACTION,
			properties.SCALIENATION,
			properties.SCNONPROFIT,
			properties.SCACCSUBMISSION,
			properties.SCPROFITDIST,
			properties.SCUSERCASSATION
		].join(" : ")
	})
	return landDocs
}

function getLotUses (coord, files) {
	resultObj = {}
	area = multiPolygonArea(coord)
	unallocated = turf.multiPolygon(coord)
	for (file of files) {
		zone = JSON.parse(fs.readFileSync("../lotdb.github.io/land/zone/" + file + ".json").toString())
		featureMultiPolys = []
		try {
			for (feature of zone.features) {
				featureMultiPolys.push(turf.multiPolygon([ feature.geometry.rings ]))
			}
		} catch (e) {
			for (feature of zone.ZONE.features) {
				if (feature.geometry.type == "Polygon") {
					featureMultiPolys.push(turf.multiPolygon([ feature.geometry.coordinates ]))
				} else {
					featureMultiPolys.push(turf.multiPolygon(feature.geometry.coordinates))
				}
			}
		}
		for (featureMultiPoly of featureMultiPolys) {
			try {
				intersection = turf.intersect(featureMultiPoly, unallocated)
			} catch (e) {
				continue
			}
			if (intersection) {
				if (intersection.geometry.type == "Polygon") {
					coord = [ turf.getCoords(intersection) ]
				} else {
					coord = turf.getCoords(intersection)
				}
				unallocated = turf.difference(unallocated, intersection)
				area = multiPolygonArea(coord)
				if (area >= 0.05) {
					if (!resultObj[file]) {
						resultObj[file] = []
					}
					resultObj[file].push({
						coord: coord,
						area: area,
						use: getFeatureUse(feature)
					})
				}
				if (!unallocated) {
					break
				}
			}
		}
		if (!unallocated) {
			break
		}
	}
	if (unallocated) {
		if (unallocated.geometry.type == "Polygon") {
			unallocatedCoord = [ turf.getCoords(unallocated) ]
		} else {
			unallocatedCoord = turf.getCoords(unallocated)
		}
		unallocatedArea = multiPolygonArea(unallocatedCoord)
		if (unallocatedArea >= 0.05) {
			resultObj.Z = [{
				coord: unallocatedCoord,
				area: unallocatedArea,
				use: "Z"
			}]
		}
	}
	return resultObj
}

async function getMemorials () {
	memorialPRN = {}
	features = await readStream("../Lot_GEOJSON/LOT_REGISTER_MEMORIAL.json")
	features.forEach(function (feature) {
		if (memorialPRN[feature.properties.PRN]) {
			memorialPRN[feature.properties.PRN].push(feature.properties.MEMORIALNO)
		} else {
			memorialPRN[feature.properties.PRN] = [ feature.properties.MEMORIALNO ]
		}
	})
	return memorialPRN
}

function getRowsForCSUID (memorialPRN) {
	csuidArr = []
	readFile("../Lot_GEOJSON/LOTLANDINFO.json").forEach(function (properties) {
		lotCode = properties.LOTCODE
		lotDisplayName = properties.LOTDISPLAYNAME ?? ""
		lotName = lotDisplayName.replace("Taxlord Lot ", "")
		arr = lotName.split(" ")
		i = 0
		while (i < arr.length && isNaN(lotName[0]) && codes[lotCode].indexOf(arr[i]) > -1) {
			lotName = lotName.replace(arr[i], "").trim()
			i = i + 1
		}
		prn = properties.PRN ?? ""
		memorial = memorialPRN[prn]
		if (!memorial) {
			memorial = []
		}
		memorial.sort()
		csuidArr.push([
			properties.LOTCSUID,
			lotCode,
			codes[lotCode],
			properties.LOTNUMBER,
			lotName,
			grantTypes[properties.CLASSCODE],
			prn,
			memorial.join(", ")
		])
	})
	return csuidArr
}

function getZones (coord, boxes) {
	testBox = getBox(coord)
	zones = {}
	for (plan in boxes) {
		box = boxes[plan]
		if (compare(testBox, box)) {
			intersection = turf.intersect(testBox.feature, box.feature)
			if (intersection) {
				if (intersection.geometry.type == "Polygon") {
					coord = [ turf.getCoords(intersection) ]
				} else {
					coord = turf.getCoords(intersection)
				}
				zones[plan] = multiPolygonArea(coord)
			}
		}
	}
	result = Object.keys(zones)
	result.sort(function (a, b) {
		return (zones[a] < zones[b]) - 0.5
	})
	return result
}

async function insert (pool, table, arr) {
	temp = []
	for (i = 0; i < arr.length; i++) {
		temp.push(arr[i])
		if (i % 1000 == 999 || i + 1 == arr.length) {
			await pool.query("INSERT IGNORE INTO " + table + " VALUES ?", [ temp ])
			temp = []
		}
	}
}

function multiPolygonArea (coord) {
    area = 0
    for (polygon of coord) {
        polygonArea = 2 * simplePolygonArea(polygon[0])
        for (simplePolygon of polygon) {
            polygonArea = polygonArea - simplePolygonArea(simplePolygon)
        }
        area = area + polygonArea
    }
    return area
}

function readFile (path) {
	return JSON.parse(fs.readFileSync(path).toString()).features.map(function (feature) {
		return feature.properties
	})
}

async function readStream (path) {
	fileStream = fs.createReadStream(path)
	rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	})
	firstLine = true
	started = false
	result = []
	tempArr = []
	for await (line of rl) {
		if (firstLine) {
			firstLine = false
		} else if (line.trim() == "{") {
			if (started) {
				tempArr[tempArr.length - 1] = "}"
				result.push(JSON.parse(tempArr.join("")))
			} else {
				started = true
			}
			tempArr = [ "{" ]
		} else {
			tempArr.push(line.trim())
		}
	}
	tempArr.pop()
	tempArr.pop()
	result.push(JSON.parse(tempArr.join("")))
	return result
}

function simplePolygonArea (coord) {
    sum = 0
    for (i = 1; i < coord.length; i++) {
        sum = sum + coord[i - 1][0] * coord[i][1] - coord[i - 1][1] * coord[i][0]
    }
    return Math.abs(sum) / 2
}

function sortObj (json) {
	keys = Object.keys(json)
	keys.sort()
	result = {}
	for (key of keys) {
		result[key] = json[key]
	}
	return result
}

function unzipAndUpdateFiles (newPlansObj) {
	for (plan in newPlansObj) {
		zip = new AdmZip("../GeoJSON_" + newPlansObj[plan] + ".zip")
		try {
			zip.extractEntryTo(newPlansObj[plan] + "/Notes_Explanatory Statement/", "./downloads/" + plan + "/pdf/", false, true)
			zip.extractEntryTo(newPlansObj[plan] + "/Plan GIS Data GeoJSON/ZONE.json", "./downloads/" + plan + "/", false, true)
			zip.extractEntryTo(newPlansObj[plan] + "/Plan GIS Data GeoJSON/PLAN_SCHEME_AREA.json", "./downloads/" + plan + "/", false, true)
			fs.copyFileSync("./downloads/" + plan + "/ZONE.json", "../lotdb.github.io/land/zone/" + plan + ".json")
			fs.copyFileSync("./downloads/" + plan + "/PLAN_SCHEME_AREA.json", "./boundaries/" + plan + ".json")
		} catch (e) {
			zip.extractEntryTo(newPlansObj[plan].toLowerCase() + "/Notes_Explanatory Statement/", "./downloads/" + plan + "/pdf/", false, true)
			zip.extractEntryTo(newPlansObj[plan].toLowerCase() + "/Plan GIS Data GeoJSON/ZONE.geojson", "./downloads/" + plan + "/", false, true)
			zip.extractEntryTo(newPlansObj[plan].toLowerCase() + "/Plan GIS Data GeoJSON/PLAN_SCHEME_AREA.geojson", "./downloads/" + plan + "/", false, true)
			fs.copyFileSync("./downloads/" + plan + "/ZONE.geojson", "../lotdb.github.io/land/zone/" + plan + ".json")
			fs.copyFileSync("./downloads/" + plan + "/PLAN_SCHEME_AREA.geojson", "./boundaries/" + plan + ".json")
		}
		for (file of fs.readdirSync("./downloads/" + plan + "/pdf")) {
			if (file.substr(-6, 6) == "_c.pdf") {
				fs.copyFileSync("./downloads/" + plan + "/pdf/" + file, "../lotdb.github.io/land/pdf/" + plan + ".pdf")
				break
			}
		}
		// fs.rmSync("../GEOJSON_" + newPlansObj[plan] + ".zip")
	}
	fs.rmSync("./downloads", { force: true, recursive: true })
}

async function writeLots (pool, landDocs) {
	const [ lotRows, fields ] = await pool.query(`
		SELECT
			lot.id,
			lot_info.lot_code,
			lot_info.lot_type,
			lot_info.lot_num,
			lot_info.lot_name,
			lot.lot_use,
			lot_info.grant_type,
			lot_info.lot_prn,
			lot_info.memorial
		FROM lot INNER JOIN lot_info ON lot.csuid = lot_info.csuid
		ORDER BY lot_info.lot_type
	`)
	json = {}
	if (lotRows.length > 0) {
		lotType = lotRows[0].lot_type
		for (lotRow of lotRows) {
			if (lotRow.lot_type != lotType) {
				fs.writeFileSync("../lotdb.github.io/land/lot/" + lotType + ".json", JSON.stringify(sortObj(json)))
				json = {}
				lotType = lotRow.lot_type
			}
			if (lotRow.lot_prn) {
				landDoc = landDocs[lotRow.lot_prn] ?? ""
			} else {
				landDoc = ""
			}
			if (!json[lotRow.lot_num]) {
				json[lotRow.lot_num] = {}
			}
			json[lotRow.lot_num][lotRow.id] = {
				CODE: lotRow.lot_code,
				NAME: lotRow.lot_name,
				COORD: JSON.parse(lotRow.coord),
				ZONE: lotRow.zone,
				GRANT: lotRow.grant_type,
				PRN: lotRow.lot_prn,
				MEMORIAL: lotRow.memorial,
				DOC: landDoc
			}
		}
		fs.writeFileSync("../lotdb.github.io/land/lot/" + lotType + ".json", JSON.stringify(sortObj(json)))
	}
}

function writeMemorials () {
	memorials = {}
	readFile("../Lot_GEOJSON/MEMORIAL.json").forEach(function (properties) {
		consideration = properties.CONSIDERATION
        if (!consideration) {
            consideration = properties.CONSIDERATIONTEXT
        }
        if (properties.CONSIDERATIONPARTCODE) {
            consideration = consideration.toString() + " " + properties.CONSIDERATIONPARTCODE
        }
		memorials[properties.MEMORIALNO] = [
			properties.INSTRUMENTDATE,
			properties.NATUREDESCRIPTION,
			consideration.toString()
		]
	})
	fs.writeFileSync("../lotdb.github.io/land/memorials.json", JSON.stringify(sortObj(memorials)))
}

function writePlaces (allPlansObj) {
	places = {}
	for (plan in allPlansObj) {
		boundaries = JSON.parse(fs.readFileSync("./boundaries/" + plan + ".json").toString())
		try {
			feature = boundaries.PLAN_SCHEME_AREA.features[0]
		} catch (e) {
			feature = boundaries.features[0]
		}
		try {
			places[plan] = feature.attributes.NAME_CHT
		} catch (e) {
			places[plan] = feature.properties.NAME_CHT
		}
	}
	fs.writeFileSync("../lotdb.github.io/land/places.json", JSON.stringify(sortObj(places)))
}