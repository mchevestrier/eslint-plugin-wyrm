import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-unused-mutually-referential.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'One used function #docs',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return n + 1;
}

foo(10);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is used #docs',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

foo(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is exported #docs',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

export function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The arrow function is exported',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

export const bar = (n: number): number => {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of the functions is referenced in a default argument',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

export function bar(n: number = foo(2)): number {
  if (n === 0) return 1;
  return n + 1;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Two functions are exported',
      code: `
export function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

export function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is included in an export list',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

const quux = 42;

export { foo, quux };

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Two functions are included in an export list',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

const quux = 42;

export { foo, quux, bar };

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions has a default export',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

export default function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions has a default export and no identifier',
      code: `
function foo(n: number): number {
  if (n <= 0) return 0;
  return n - 1;
}

export default function (n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is default exported later',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

export default bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is aliased to a used identifier',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

const fnord = foo;
fnord(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is aliased to a technically used identifier (identifier in expression statement)',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

const fnord = foo;

fnord; // This counts as being used for now
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is referenced as initialization of a destructuring assignment',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

const { length } = foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function is used in inner function of exported function',
      code: `
export function myExportedFunction() {
  function myInnerFunction() {
    return foo();
  }

  return myInnerFunction();
}

function foo() {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function is used in JSX of exported component',
      code: `
export function MyExportedComponent() {
  return <Foo />;
}

function Foo() {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function is used in JSX of inner component in exported component',
      code: `
export function MyExportedComponent() {
  function InnerComponent() {
    return <Foo />;
  }
  return <InnerComponent />;
}

function Foo() {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an alias used in JSX',
      code: `
const Baz = Foo;

export function MyExportedComponent() {
  function InnerComponent() {
    return <Baz />;
  }
  return <InnerComponent />;
}

function Foo() {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The function is used in static JSX',
      code: `
const Baz = <Foo />;

function Foo() {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The function is used in a static JSX expression statement',
      code: `
<Foo />;

function Foo() {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an alias used in static JSX',
      code: `
const Bar = Foo;
const Baz = <Bar />;

function Foo() {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of the two functions is referenced in a type annotation',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

const fnord: ReturnType<typeof foo> = 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Usage in extremely nested code',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return 42;
}

// 500 nested call expressions
f500(f499(f498(f497(f496(f495(f494(f493(f492(f491(f490(f489(f488(f487(f486(f485(f484(f483(f482(f481(f480(f479(f478(f477(f476(f475(f474(f473(f472(f471(f470(f469(f468(f467(f466(f465(f464(f463(f462(f461(f460(f459(f458(f457(f456(f455(f454(f453(f452(f451(f450(f449(f448(f447(f446(f445(f444(f443(f442(f441(f440(f439(f438(f437(f436(f435(f434(f433(f432(f431(f430(f429(f428(f427(f426(f425(f424(f423(f422(f421(f420(f419(f418(f417(f416(f415(f414(f413(f412(f411(f410(f409(f408(f407(f406(f405(f404(f403(f402(f401(f400(f399(f398(f397(f396(f395(f394(f393(f392(f391(f390(f389(f388(f387(f386(f385(f384(f383(f382(f381(f380(f379(f378(f377(f376(f375(f374(f373(f372(f371(f370(f369(f368(f367(f366(f365(f364(f363(f362(f361(f360(f359(f358(f357(f356(f355(f354(f353(f352(f351(f350(f349(f348(f347(f346(f345(f344(f343(f342(f341(f340(f339(f338(f337(f336(f335(f334(f333(f332(f331(f330(f329(f328(f327(f326(f325(f324(f323(f322(f321(f320(f319(f318(f317(f316(f315(f314(f313(f312(f311(f310(f309(f308(f307(f306(f305(f304(f303(f302(f301(f300(f299(f298(f297(f296(f295(f294(f293(f292(f291(f290(f289(f288(f287(f286(f285(f284(f283(f282(f281(f280(f279(f278(f277(f276(f275(f274(f273(f272(f271(f270(f269(f268(f267(f266(f265(f264(f263(f262(f261(f260(f259(f258(f257(f256(f255(f254(f253(f252(f251(f250(f249(f248(f247(f246(f245(f244(f243(f242(f241(f240(f239(f238(f237(f236(f235(f234(f233(f232(f231(f230(f229(f228(f227(f226(f225(f224(f223(f222(f221(f220(f219(f218(f217(f216(f215(f214(f213(f212(f211(f210(f209(f208(f207(f206(f205(f204(f203(f202(f201(f200(f199(f198(f197(f196(f195(f194(f193(f192(f191(f190(f189(f188(f187(f186(f185(f184(f183(f182(f181(f180(f179(f178(f177(f176(f175(f174(f173(f172(f171(f170(f169(f168(f167(f166(f165(f164(f163(f162(f161(f160(f159(f158(f157(f156(f155(f154(f153(f152(f151(f150(f149(f148(f147(f146(f145(f144(f143(f142(f141(f140(f139(f138(f137(f136(f135(f134(f133(f132(f131(f130(f129(f128(f127(f126(f125(f124(f123(f122(f121(f120(f119(f118(f117(f116(f115(f114(f113(f112(f111(f110(f109(f108(f107(f106(f105(f104(f103(f102(f101(f100(f99(f98(f97(f96(f95(f94(f93(f92(f91(f90(f89(f88(f87(f86(f85(f84(f83(f82(f81(f80(f79(f78(f77(f76(f75(f74(f73(f72(f71(f70(f69(f68(f67(f66(f65(f64(f63(f62(f61(f60(f59(f58(f57(f56(f55(f54(f53(f52(f51(f50(f49(f48(f47(f46(f45(f44(f43(f42(f41(f40(f39(f38(f37(f36(f35(f34(f33(f32(f31(f30(f29(f28(f27(f26(f25(f24(f23(f22(f21(f20(f19(f18(f17(f16(f15(f14(f13(f12(f11(f10(f9(f8(f7(f6(f5(f4(f3(f2(f1(foo))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));

// 1000 nested call expressions is too deep for the parser to handle
// f1000(f999(f998(f997(f996(f995(f994(f993(f992(f991(f990(f989(f988(f987(f986(f985(f984(f983(f982(f981(f980(f979(f978(f977(f976(f975(f974(f973(f972(f971(f970(f969(f968(f967(f966(f965(f964(f963(f962(f961(f960(f959(f958(f957(f956(f955(f954(f953(f952(f951(f950(f949(f948(f947(f946(f945(f944(f943(f942(f941(f940(f939(f938(f937(f936(f935(f934(f933(f932(f931(f930(f929(f928(f927(f926(f925(f924(f923(f922(f921(f920(f919(f918(f917(f916(f915(f914(f913(f912(f911(f910(f909(f908(f907(f906(f905(f904(f903(f902(f901(f900(f899(f898(f897(f896(f895(f894(f893(f892(f891(f890(f889(f888(f887(f886(f885(f884(f883(f882(f881(f880(f879(f878(f877(f876(f875(f874(f873(f872(f871(f870(f869(f868(f867(f866(f865(f864(f863(f862(f861(f860(f859(f858(f857(f856(f855(f854(f853(f852(f851(f850(f849(f848(f847(f846(f845(f844(f843(f842(f841(f840(f839(f838(f837(f836(f835(f834(f833(f832(f831(f830(f829(f828(f827(f826(f825(f824(f823(f822(f821(f820(f819(f818(f817(f816(f815(f814(f813(f812(f811(f810(f809(f808(f807(f806(f805(f804(f803(f802(f801(f800(f799(f798(f797(f796(f795(f794(f793(f792(f791(f790(f789(f788(f787(f786(f785(f784(f783(f782(f781(f780(f779(f778(f777(f776(f775(f774(f773(f772(f771(f770(f769(f768(f767(f766(f765(f764(f763(f762(f761(f760(f759(f758(f757(f756(f755(f754(f753(f752(f751(f750(f749(f748(f747(f746(f745(f744(f743(f742(f741(f740(f739(f738(f737(f736(f735(f734(f733(f732(f731(f730(f729(f728(f727(f726(f725(f724(f723(f722(f721(f720(f719(f718(f717(f716(f715(f714(f713(f712(f711(f710(f709(f708(f707(f706(f705(f704(f703(f702(f701(f700(f699(f698(f697(f696(f695(f694(f693(f692(f691(f690(f689(f688(f687(f686(f685(f684(f683(f682(f681(f680(f679(f678(f677(f676(f675(f674(f673(f672(f671(f670(f669(f668(f667(f666(f665(f664(f663(f662(f661(f660(f659(f658(f657(f656(f655(f654(f653(f652(f651(f650(f649(f648(f647(f646(f645(f644(f643(f642(f641(f640(f639(f638(f637(f636(f635(f634(f633(f632(f631(f630(f629(f628(f627(f626(f625(f624(f623(f622(f621(f620(f619(f618(f617(f616(f615(f614(f613(f612(f611(f610(f609(f608(f607(f606(f605(f604(f603(f602(f601(f600(f599(f598(f597(f596(f595(f594(f593(f592(f591(f590(f589(f588(f587(f586(f585(f584(f583(f582(f581(f580(f579(f578(f577(f576(f575(f574(f573(f572(f571(f570(f569(f568(f567(f566(f565(f564(f563(f562(f561(f560(f559(f558(f557(f556(f555(f554(f553(f552(f551(f550(f549(f548(f547(f546(f545(f544(f543(f542(f541(f540(f539(f538(f537(f536(f535(f534(f533(f532(f531(f530(f529(f528(f527(f526(f525(f524(f523(f522(f521(f520(f519(f518(f517(f516(f515(f514(f513(f512(f511(f510(f509(f508(f507(f506(f505(f504(f503(f502(f501(f500(f499(f498(f497(f496(f495(f494(f493(f492(f491(f490(f489(f488(f487(f486(f485(f484(f483(f482(f481(f480(f479(f478(f477(f476(f475(f474(f473(f472(f471(f470(f469(f468(f467(f466(f465(f464(f463(f462(f461(f460(f459(f458(f457(f456(f455(f454(f453(f452(f451(f450(f449(f448(f447(f446(f445(f444(f443(f442(f441(f440(f439(f438(f437(f436(f435(f434(f433(f432(f431(f430(f429(f428(f427(f426(f425(f424(f423(f422(f421(f420(f419(f418(f417(f416(f415(f414(f413(f412(f411(f410(f409(f408(f407(f406(f405(f404(f403(f402(f401(f400(f399(f398(f397(f396(f395(f394(f393(f392(f391(f390(f389(f388(f387(f386(f385(f384(f383(f382(f381(f380(f379(f378(f377(f376(f375(f374(f373(f372(f371(f370(f369(f368(f367(f366(f365(f364(f363(f362(f361(f360(f359(f358(f357(f356(f355(f354(f353(f352(f351(f350(f349(f348(f347(f346(f345(f344(f343(f342(f341(f340(f339(f338(f337(f336(f335(f334(f333(f332(f331(f330(f329(f328(f327(f326(f325(f324(f323(f322(f321(f320(f319(f318(f317(f316(f315(f314(f313(f312(f311(f310(f309(f308(f307(f306(f305(f304(f303(f302(f301(f300(f299(f298(f297(f296(f295(f294(f293(f292(f291(f290(f289(f288(f287(f286(f285(f284(f283(f282(f281(f280(f279(f278(f277(f276(f275(f274(f273(f272(f271(f270(f269(f268(f267(f266(f265(f264(f263(f262(f261(f260(f259(f258(f257(f256(f255(f254(f253(f252(f251(f250(f249(f248(f247(f246(f245(f244(f243(f242(f241(f240(f239(f238(f237(f236(f235(f234(f233(f232(f231(f230(f229(f228(f227(f226(f225(f224(f223(f222(f221(f220(f219(f218(f217(f216(f215(f214(f213(f212(f211(f210(f209(f208(f207(f206(f205(f204(f203(f202(f201(f200(f199(f198(f197(f196(f195(f194(f193(f192(f191(f190(f189(f188(f187(f186(f185(f184(f183(f182(f181(f180(f179(f178(f177(f176(f175(f174(f173(f172(f171(f170(f169(f168(f167(f166(f165(f164(f163(f162(f161(f160(f159(f158(f157(f156(f155(f154(f153(f152(f151(f150(f149(f148(f147(f146(f145(f144(f143(f142(f141(f140(f139(f138(f137(f136(f135(f134(f133(f132(f131(f130(f129(f128(f127(f126(f125(f124(f123(f122(f121(f120(f119(f118(f117(f116(f115(f114(f113(f112(f111(f110(f109(f108(f107(f106(f105(f104(f103(f102(f101(f100(f99(f98(f97(f96(f95(f94(f93(f92(f91(f90(f89(f88(f87(f86(f85(f84(f83(f82(f81(f80(f79(f78(f77(f76(f75(f74(f73(f72(f71(f70(f69(f68(f67(f66(f65(f64(f63(f62(f61(f60(f59(f58(f57(f56(f55(f54(f53(f52(f51(f50(f49(f48(f47(f46(f45(f44(f43(f42(f41(f40(f39(f38(f37(f36(f35(f34(f33(f32(f31(f30(f29(f28(f27(f26(f25(f24(f23(f22(f21(f20(f19(f18(f17(f16(f15(f14(f13(f12(f11(f10(f9(f8(f7(f6(f5(f4(f3(f2(f1(foo))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With an arrow function with no name',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

const { length } = function (n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
};
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'One unused function #docs',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return n + 1;
}

// foo() is not used anywhere
`,
      errors: [{ messageId: 'noUnusedMutuallyReferential' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Two unused functions #docs',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

// foo() and bar() are not used anywhere else
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a unused function alias',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

const fnord = foo;
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Three unused functions #docs',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return baz(n - 1) + 1;
}

function baz(n: number): number {
  if (n === 0) return 42;
  return foo(n - 1);
}

// foo(), bar() and baz() are not used anywhere else
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The third function is definitely unused',
      code: `
function baz(n: number): number {
  if (n === 0) return 42;
  return foo(n - 1);
}

function foo(n: number): number {
  if (n === 0) return 0;
  return baz(42);
}

function bar(n: number): number {
  if (n === 0) return baz(1);
  return foo(n - 1) + 1;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The second function is definitely unused',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return 42;
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function declaration and an arrow function',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

const bar = (n: number): number => {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
};
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function declaration and a function expression',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

const bar = function (n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
};
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function declaration, an arrow function and a function expression',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

const bar = (n: number): number => {
  if (n === 0) return 1;
  return baz(n - 1) + 1;
};

const baz = function (n: number): number {
  if (n === 0) return 42;
  return foo(n - 1);
};
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With two unused arrow functions',
      code: `
const foo = (n: number): number => {
  if (n === 0) return 0;
  return bar(n - 1);
};

const bar = (n: number): number => {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
};
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of the two functions is referenced in a type annotation on some arrow function',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

const fnord: typeof foo = () => 42;
`,

      errors: [{ messageId: 'noUnusedMutuallyReferential' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With inner functions',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  function baz() {
    foo(10);
  }
  baz();

  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of the functions is referenced in a default argument',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number = foo(2)): number {
  if (n === 0) return 1;
  return n + 1;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of two functions is aliased to a unused identifier (identifier in expression statement)',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

foo;
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some direct recursion',
      code: `
function foo(n: number): number {
  if (n === 0) return foo(42);
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of the two functions only has direct recursion',
      code: `
function foo(n: number): number {
  if (n === 0) return foo(42);
  return 42;
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Two unused functions inside an exported function',
      code: `
export function myExportedFunction() {
  function foo(n: number): number {
    if (n === 0) return 0;
    return bar(n - 1);
  }

  function bar(n: number): number {
    if (n === 0) return 1;
    return foo(n - 1) + 1;
  }

  return 42;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Two unused functions inside an unused function',
      code: `
function myUnusedFunction() {
  function foo(n: number): number {
    if (n === 0) return 0;
    return bar(n - 1);
  }

  function bar(n: number): number {
    if (n === 0) return 1;
    return foo(n - 1) + 1;
  }

  return 42;
}
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One function only contains recursive calls',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  if (n <= 100) return 0;
  return foo(n - 1);
}
`,
      errors: [{ messageId: 'noUnusedMutuallyReferential' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'One of the two unused functions has write references only',
      code: `
function foo(n: number): number {
  if (n === 0) return 0;
  return bar(n - 1);
}

function bar(n: number): number {
  if (n === 0) return 1;
  return foo(n - 1) + 1;
}

foo = () => {};
`,
      errors: [
        { messageId: 'noUnusedMutuallyReferential' },
        { messageId: 'noUnusedMutuallyReferential' },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
