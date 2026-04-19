/* =========================================================
   CRITTER QUEST — ALL VIEWS
   Retro pixel-art. Each view = 2 variations.
   Sprites use the PixelSprite engine (inline grid, crisp).
   ========================================================= */

const { useState } = React;

/* -------- Pixel sprite engine -------- */
function PixelSprite({ data, palette, scale = 3, style = {} }) {
  const w = data[0].length;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${w}, ${scale}px)`,
      imageRendering: 'pixelated',
      width: w * scale,
      ...style,
    }}>
      {data.flatMap((row, y) => row.split('').map((ch, x) => (
        <div key={`${x}-${y}`} style={{
          background: ch === '.' ? 'transparent' : palette[ch] || 'transparent',
          width: scale, height: scale,
        }}/>
      )))}
    </div>
  );
}

/* -------- Sprite atlas (original designs) -------- */
const SPR = {
  voltpip: { palette: {'1':'#d8a820','2':'#fce078','3':'#1a1420','4':'#a87800'},
    data: ["..1..1....",".121.121..",".1221221..","12222222..","12232232..","12222222..","12222222..",".144244...","..3..3...."] },
  leafling: { palette: {'1':'#4a8030','2':'#8fc758','3':'#1a1420','4':'#2d5020','5':'#6fb544'},
    data: ["....5.....","...555....","..11111...",".1122211..",".1222221..","112333211.","11223321..",".1122211..","..4...4...","..3...3..."] },
  emberpup: { palette: {'1':'#c83820','2':'#e54b4b','3':'#1a1420','4':'#f89040','5':'#ffc040'},
    data: ["....5.....","...555....","..11.11...",".1122211..","112222211.","11232232..","11222222..","11244422..",".1.1.1.1..","..3...3..."] },
  sparklet: { palette: {'1':'#8040a8','2':'#b572d9','3':'#1a1420','4':'#5020a0','5':'#f4c430'},
    data: ["....5.....","...151....","..11111...",".1122211..","112332211.","112222211.",".12222221.","..123321..","..1...1...",".5.....5.."] },
  house: { palette: {'1':'#e54b4b','2':'#f89040','3':'#a87848','4':'#6b4020','5':'#2d5020'},
    data: ["....11....","...1221...","..122221..",".12222221.","122222221.","33333333..","3.44.443..","3.44.443..","3344.4.3..","33333333.."] },
  tree: { palette: {'3':'#2d5020','4':'#6b4020','5':'#4a7c2a'},
    data: ["....3.....","...355....","..35553...",".3555553..","..35553...",".3555553..","3555553...","...4.4....","...4.4....","...444...."] },
  flower: { palette: {'1':'#f4c430','2':'#fce078','3':'#e08800','4':'#4a7c2a'},
    data: ["...121....","..12321...",".1232321..",".1233321..","..12321...","...141....","....4.....","...444....","....4.....","....4....."] },
  drop: { palette: {'1':'#8fe0f0','2':'#4ab8d8','3':'#2870a8'},
    data: ["....11....","....12....","...1122...","...1222...","..122222..",".1222222..",".1222233..",".1222223..","..122223..","...2223..."] },
  campfire: { palette: {'1':'#e54b4b','2':'#f89040','3':'#6b4020','4':'#a87848','5':'#ffc040'},
    data: ["....5.....","...525....","..12521...",".1252521..","..12521...","...111....","..33333...",".33444433.","44444444..","33333333.."] },
  volcano: { palette: {'1':'#e54b4b','2':'#f89040','3':'#6b4020','5':'#ffc040'},
    data: ["....5.....","...515....","...121....","..11211...","..32223...",".3322233..",".3322233..","33322233..","33322233..","33333333.."] },
  tower: { palette: {'3':'#786c68','5':'#f4c430'},
    data: ["....5.....","...535....","....5.....","...333....","..33333...","..3.3.3...","..33333...","..3.3.3...","..33333...",".3333333.."] },
  umbrella: { palette: {'1':'#e54b4b','2':'#fce078','3':'#6b4020'},
    data: ["....1.....","..12121...",".1121211..","121212121.","1111111111","....1.....","....1.....","....1.....","....31....","...33....."] },
  rainbow: { palette: {'1':'#e54b4b','2':'#f89040','3':'#f4c430','4':'#6fb544','5':'#4ab8d8'},
    data: ["..1111111.",".11111111.",".12222221.","122222221.","123333321.","123443321.","124444421.","155555551.","155555551.","..1.....1."] },
  npcKid: { palette: {'1':'#4a78c8','2':'#f4d8a8','3':'#a87848','4':'#3d2b3f'},
    data: [".333.",".323.",".121.","11211",".111.",".4.4.",".4.4."] },
  npcCap: { palette: {'1':'#6fb544','2':'#f4d8a8','3':'#c83820','4':'#3d2b3f','5':'#e54b4b'},
    data: [".555.",".525.",".121.","11211",".333.",".3.3.",".4.4."] },
  chick: { palette: {'1':'#fce078','2':'#1a1420','3':'#e08800'},
    data: [".11..","1121.","11211",".111.",".3.3."] },
  bunny: { palette: {'1':'#f4e8c8','2':'#1a1420','3':'#b8a878'},
    data: ["1.1..","1.1..",".11..","1121.",".111.",".3.3."] },
  fish: { palette: {'1':'#f89040','2':'#1a1420','3':'#e54b4b'},
    data: ["..11..",".1121.","111113",".1111.","...1.."] },
  butterfly: { palette: {'1':'#b572d9','2':'#1a1420'},
    data: ["1.2.1","11211","11211","1.2.1"] },
  // UI glyphs
  bolt: { palette: {'1':'#f4c430','2':'#e08800'},
    data: ["..11.","..11.",".111.","..1..",".111.",".11..","11...","1...."] },
  leaf: { palette: {'1':'#6fb544','2':'#2d5020'},
    data: ["..111","..112",".1112",".1122","11122","11222","22222","2222."] },
  fire: { palette: {'1':'#e54b4b','2':'#f89040','3':'#ffc040'},
    data: ["..3..",".323.","12221","12221","12321","11211",".111.","..1.."] },
  sparkle: { palette: {'1':'#b572d9','2':'#d8a8e8'},
    data: ["..1..","..1..",".121.","11.11",".121.","..1..","..1..","..1.."] },
  foot: { palette: {'1':'#e08800','2':'#f4c430'},
    data: ["..11..",".1221.",".1221.","112211","122221","111111"] },
  book: { palette: {'1':'#6b4020','2':'#f4e8c8'},
    data: ["111111","121121","121121","122221","121121","111111"] },
  paw: { palette: {'1':'#2d5020'},
    data: ["11..11","11..11","......",".1111.","111111","1.11.1"] },
  lock: { palette: {'1':'#786c68','2':'#c8c0b8','3':'#1a1420'},
    data: [".111.","1.1.1","1.1.1","11111","12221","12321","12221","11111"] },
  star: { palette: {'1':'#f4c430','2':'#fce078'},
    data: ["....11....","...1221...","..122221..","111222111.","122222221.",".12222221.","..122221..","..1.22.1..",".1..11..1."] },
  close: { palette: {'1':'#e54b4b','2':'#1a1420'},
    data: ["11...11","121.121",".12121.","..121..",".12121.","121.121","11...11"] },
};

/* -------- Shared pixel-style helpers -------- */
const PIXEL_FONT = { fontFamily: "'Press Start 2P', monospace" };
const BODY_FONT  = { fontFamily: "'VT323', monospace" };
const INK = '#1a1420';
const PAPER = '#f4e8c8';
const UI_BG = '#fff4d8';

function Panel({ children, style = {}, color = INK, bg = UI_BG }) {
  return (
    <div style={{
      background: bg,
      border: `3px solid ${color}`,
      boxShadow: `3px 3px 0 0 ${color}`,
      ...style
    }}>{children}</div>
  );
}

function Chip({ children, color = INK, bg = UI_BG, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px',
      background: bg,
      border: `3px solid ${color}`,
      boxShadow: `2px 2px 0 0 ${INK}`,
      fontSize: 9, color: INK,
      ...PIXEL_FONT, ...style
    }}>{children}</div>
  );
}

function PixelButton({ children, bg='#f4c430', color=INK, onClick, style={}, full=false }) {
  return (
    <button onClick={onClick} style={{
      ...PIXEL_FONT,
      fontSize: 10, color,
      background: bg,
      border: `3px solid ${INK}`,
      padding: '10px 14px',
      boxShadow: `3px 3px 0 0 ${INK}`,
      cursor: 'pointer',
      width: full ? '100%' : 'auto',
      letterSpacing: '0.5px',
      ...style
    }}>{children}</button>
  );
}

/* ========== SHARED HEADER ========== */
function GameHeader({ mp = 5, captured = 0 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px',
      background: UI_BG, border: `3px solid ${INK}`,
      boxShadow: `3px 3px 0 0 ${INK}`,
      marginBottom: 12,
    }}>
      <PixelSprite {...SPR.house} scale={2} />
      <div style={{ flex: 1 }}>
        <div style={{ ...PIXEL_FONT, fontSize: 11, color: INK, lineHeight: 1.3 }}>
          ENGLISH<br/>QUEST
        </div>
        <div style={{ ...BODY_FONT, fontSize: 14, color: '#3d2b3f' }}>
          Tasks done: 0
        </div>
      </div>
      <Chip color="#f4c430" bg="#fffbdc">
        <PixelSprite {...SPR.foot} scale={1.6}/><span>{mp}</span>
      </Chip>
      <Chip color="#8b5a2b" bg="#f0dcb0">
        <PixelSprite {...SPR.book} scale={1.6}/>
      </Chip>
      <Chip color="#6fb544" bg="#e0f4c8">
        <PixelSprite {...SPR.paw} scale={1.6}/><span>{captured}</span>
      </Chip>
    </div>
  );
}

function StatsRow({ counts = {fire:0, leaf:0, spark:0, shine:0} }) {
  const els = [
    ['fire',  '#e54b4b', '#fff0e4', SPR.fire],
    ['leaf',  '#6fb544', '#effbe0', SPR.leaf],
    ['spark', '#f4c430', '#fffbdc', SPR.bolt],
    ['shine', '#b572d9', '#f7ecfc', SPR.sparkle],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
      {els.map(([k, c, bg, icon]) => (
        <div key={k} style={{
          background: bg, border: `3px solid ${c}`,
          boxShadow: `2px 2px 0 0 ${INK}`,
          padding: '7px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          ...PIXEL_FONT, fontSize: 10, color: INK,
        }}>
          <PixelSprite {...icon} scale={1.6}/>
          <span>{counts[k]}</span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   VIEW 1 — TASK / QUIZ SCREEN
   ========================================================= */

function TaskViewA() {
  const [selected, setSelected] = useState(null);
  const answers = ['speak', 'speaking', 'spoke', 'speaks'];
  const correct = 'speaks';

  return (
    <div style={{ padding: 16, background: PAPER, width: 520, minHeight: 700,
                  ...BODY_FONT, backgroundImage:
                  'repeating-linear-gradient(0deg,transparent 0 19px,rgba(0,0,0,.04) 19px 20px)'}}>
      <GameHeader mp={4}/>
      <StatsRow />
      <Panel style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PixelSprite {...SPR.campfire} scale={2.2}/>
            <div style={{ ...PIXEL_FONT, fontSize: 14, color: INK }}>CAMPFIRE</div>
          </div>
          <Chip color="#e54b4b" bg="#ffe4d4"><PixelSprite {...SPR.star} scale={1.4}/><span>EASY</span></Chip>
        </div>

        <div style={{ ...PIXEL_FONT, fontSize: 9, color: '#6b4020', marginBottom: 14 }}>
          ▸ FILL IN THE BLANK
        </div>

        <div style={{
          ...BODY_FONT, fontSize: 30, color: INK,
          background: UI_BG, border: `3px dashed ${INK}`,
          padding: '18px 20px', marginBottom: 18,
          textAlign: 'center', lineHeight: 1.3,
        }}>
          She <span style={{
            display: 'inline-block', minWidth: 110, borderBottom: `4px solid #e54b4b`,
            margin: '0 4px'
          }}>{selected && selected !== 'close' ? selected : '\u00A0'}</span> English very well.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {answers.map(a => {
            const isSel = selected === a;
            const isRight = selected && a === correct;
            const isWrong = isSel && a !== correct;
            let bg = UI_BG, bd = INK;
            if (isRight && isSel) { bg = '#c8e890'; bd = '#2d5020'; }
            else if (isWrong) { bg = '#ffb8b8'; bd = '#c83820'; }
            else if (selected && a === correct) { bg = '#c8e890'; bd = '#2d5020'; }
            return (
              <button key={a} onClick={() => setSelected(a)} style={{
                ...PIXEL_FONT, fontSize: 11, padding: '14px 8px',
                background: bg, border: `3px solid ${bd}`,
                boxShadow: `3px 3px 0 0 ${INK}`,
                cursor: 'pointer', color: INK,
              }}>
                {a.toUpperCase()}
              </button>
            );
          })}
        </div>

        <PixelButton bg="#e0d8c8" full>◂ CLOSE</PixelButton>
      </Panel>
    </div>
  );
}

function TaskViewB() {
  const [selected, setSelected] = useState('speaks');
  return (
    <div style={{ padding: 16, background: '#1a1420', width: 520, minHeight: 700, ...BODY_FONT }}>
      <div style={{
        background: '#2a1830', border: `3px solid #f4c430`,
        boxShadow: '3px 3px 0 0 #000', padding: 12, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <PixelSprite {...SPR.campfire} scale={2.4}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...PIXEL_FONT, fontSize: 13, color: '#f4c430' }}>CAMPFIRE QUEST</div>
          <div style={{ ...BODY_FONT, fontSize: 16, color: '#fce078' }}>Battle #07 · Grammar</div>
        </div>
        <Chip color="#e54b4b" bg="#4a1020" style={{ color: '#ffc0c0' }}>
          <PixelSprite {...SPR.fire} scale={1.4}/><span>+1 FIRE</span>
        </Chip>
      </div>

      {/* Dialog box like classic RPG */}
      <div style={{
        background: '#f4e8c8', border: `4px solid #1a1420`,
        boxShadow: 'inset 0 0 0 2px #f4c430, 4px 4px 0 0 #000',
        padding: 18, marginBottom: 14, position: 'relative', minHeight: 130,
      }}>
        <div style={{ ...PIXEL_FONT, fontSize: 9, color: '#6b4020', marginBottom: 10 }}>
          ▸ COMPLETE THE SENTENCE
        </div>
        <div style={{ ...BODY_FONT, fontSize: 28, color: INK, lineHeight: 1.4 }}>
          She <span style={{
            background: '#ffc040', padding: '0 10px',
            border: `3px solid ${INK}`, display: 'inline-block',
            minWidth: 100, textAlign: 'center',
          }}>{selected || '?'}</span> English very well.
        </div>
        <div style={{
          position: 'absolute', bottom: 6, right: 10,
          ...PIXEL_FONT, fontSize: 8, color: '#e54b4b',
          animation: 'none'
        }}>▼</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {['speak','speaking','spoke','speaks'].map((a, i) => (
          <button key={a} onClick={() => setSelected(a)} style={{
            ...PIXEL_FONT, fontSize: 11, padding: '16px 8px',
            background: selected === a ? '#c8e890' : '#2a1830',
            color: selected === a ? INK : '#fce078',
            border: `3px solid ${selected === a ? '#2d5020' : '#f4c430'}`,
            boxShadow: `3px 3px 0 0 #000`,
            cursor: 'pointer', textAlign: 'left', paddingLeft: 16,
          }}>
            <span style={{ color: selected === a ? '#2d5020' : '#e54b4b', marginRight: 8 }}>
              {['A','B','C','D'][i]}▸
            </span>
            {a.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <PixelButton bg="#e54b4b" style={{ flex: 1, color: '#fff' }}>◂ FLEE</PixelButton>
        <PixelButton bg="#6fb544" style={{ flex: 2, color: '#fff' }}>ATTACK ▸</PixelButton>
      </div>
    </div>
  );
}

/* =========================================================
   VIEW 2 — CRITTER COLLECTION (POKÉDEX-STYLE BOOK)
   ========================================================= */

function CritterCard({ name, spr, element, elColor, bgColor, count, cap, badge, stage = 1, variant = 'A' }) {
  const pct = (count / cap) * 100;
  return (
    <div style={{
      background: bgColor,
      border: `3px solid ${INK}`,
      boxShadow: `3px 3px 0 0 ${INK}`,
      padding: 12,
      position: 'relative',
    }}>
      {variant === 'A' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{
              width: 72, height: 72, display: 'grid', placeItems: 'center',
              background: '#fff', border: `3px solid ${INK}`,
              boxShadow: `inset 0 0 0 2px ${elColor}`,
            }}>
              <PixelSprite {...spr} scale={3.5}/>
            </div>
          </div>
          <div style={{ ...PIXEL_FONT, fontSize: 11, color: INK, textAlign: 'center', marginBottom: 6 }}>
            {name.toUpperCase()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 10, height: 10,
                background: i < stage ? elColor : '#c8c0b8',
                border: `2px solid ${INK}`,
              }}/>
            ))}
            <span style={{ ...PIXEL_FONT, fontSize: 8, color: INK, marginLeft: 4 }}>
              STAGE {stage}/3
            </span>
          </div>
          {/* XP bar */}
          <div style={{
            height: 14, background: '#fff', border: `3px solid ${INK}`, marginBottom: 8,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${pct}%`, background: elColor,
              backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,.2) 0 4px, transparent 4px 8px)`,
            }}/>
          </div>
          <div style={{ ...PIXEL_FONT, fontSize: 9, color: INK, textAlign: 'center', marginBottom: 8 }}>
            {count}/{cap}
          </div>
          <div style={{
            padding: '6px 8px', background: 'rgba(0,0,0,.05)',
            border: `2px dashed ${INK}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            ...PIXEL_FONT, fontSize: 8, color: '#6b4020'
          }}>
            <PixelSprite {...SPR.lock} scale={1.4}/>
            <span>{badge}</span>
          </div>
        </>
      )}
    </div>
  );
}

function CritterDexCard({ id, sprite, name, element, elColor, bgColor, number, count, cap }) {
  const pct = (count / cap) * 100;
  return (
    <div style={{
      background: bgColor,
      border: `3px solid ${INK}`,
      boxShadow: `3px 3px 0 0 ${INK}`,
      padding: 10,
      display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10,
    }}>
      <div style={{
        background: '#fff', border: `3px solid ${INK}`,
        display: 'grid', placeItems: 'center', padding: 6,
      }}>
        <PixelSprite {...sprite} scale={3.2}/>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <div style={{ ...PIXEL_FONT, fontSize: 10, color: INK }}>{name.toUpperCase()}</div>
          <div style={{ ...PIXEL_FONT, fontSize: 8, color: '#6b4020' }}>Nº{number}</div>
        </div>
        <div style={{
          display: 'inline-block', ...PIXEL_FONT, fontSize: 7,
          background: elColor, color: '#fff', padding: '3px 6px',
          border: `2px solid ${INK}`, marginBottom: 6,
        }}>{element.toUpperCase()}</div>
        <div style={{ height: 10, background: '#fff', border: `2px solid ${INK}`, marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: elColor }}/>
        </div>
        <div style={{ ...PIXEL_FONT, fontSize: 8, color: INK }}>
          {count}/{cap} · STG {Math.min(3, Math.floor(count/2) + 1)}/3
        </div>
      </div>
    </div>
  );
}

function CollectionViewA() {
  const critters = [
    { name: 'Voltpip',  spr: SPR.voltpip,  elColor: '#f4c430', bgColor: '#fff8dc', count: 0, cap: 6, badge: 'SPARK COLLECTOR (3/6)' },
    { name: 'Leafling', spr: SPR.leafling, elColor: '#6fb544', bgColor: '#e4f4cc', count: 0, cap: 6, badge: 'SEED GATHERER (3/6)' },
    { name: 'Emberpup', spr: SPR.emberpup, elColor: '#e54b4b', bgColor: '#ffe4d4', count: 0, cap: 6, badge: 'FLAME STARTER (3/6)' },
    { name: 'Sparklet', spr: SPR.sparklet, elColor: '#b572d9', bgColor: '#eed8f4', count: 0, cap: 6, badge: 'STAR SEEKER (3/6)' },
  ];
  return (
    <div style={{ padding: 16, background: PAPER, width: 520, minHeight: 720, ...BODY_FONT,
                  backgroundImage: 'repeating-linear-gradient(0deg,transparent 0 19px,rgba(0,0,0,.04) 19px 20px)'}}>
      <GameHeader mp={4}/>
      <StatsRow />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {critters.map(c => <CritterCard key={c.name} {...c} stage={1} variant="A"/>)}
      </div>
      <div style={{ textAlign: 'center', ...BODY_FONT, fontSize: 16, color: '#6b4020', marginTop: 12 }}>
        ▸ Collect element items on the map!
      </div>
    </div>
  );
}

function CollectionViewB() {
  const critters = [
    { name: 'Voltpip',  sprite: SPR.voltpip,  element: 'spark', elColor: '#f4c430', bgColor: '#fff8dc', number: '001', count: 2, cap: 6 },
    { name: 'Leafling', sprite: SPR.leafling, element: 'leaf',  elColor: '#6fb544', bgColor: '#e4f4cc', number: '002', count: 4, cap: 6 },
    { name: 'Emberpup', sprite: SPR.emberpup, element: 'fire',  elColor: '#e54b4b', bgColor: '#ffe4d4', number: '003', count: 1, cap: 6 },
    { name: 'Sparklet', sprite: SPR.sparklet, element: 'shine', elColor: '#b572d9', bgColor: '#eed8f4', number: '004', count: 0, cap: 6 },
  ];

  return (
    <div style={{ padding: 16, background: '#1a1420', width: 520, minHeight: 720, ...BODY_FONT }}>
      {/* Book header */}
      <div style={{
        background: '#6b4020', border: `4px solid #3d2010`,
        boxShadow: 'inset 0 0 0 3px #f4c430, 3px 3px 0 0 #000',
        padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <PixelSprite {...SPR.book} scale={3}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...PIXEL_FONT, fontSize: 14, color: '#f4c430', lineHeight: 1.2 }}>CRITTER<br/>DEX</div>
          <div style={{ ...BODY_FONT, fontSize: 14, color: '#fce078', marginTop: 2 }}>
            Registered: 3 / 4
          </div>
        </div>
        <Chip color="#e54b4b" bg="#2a1020" style={{ color: '#ffc0c0' }}>× CLOSE</Chip>
      </div>

      {/* Page corner */}
      <div style={{
        background: '#f4e8c8',
        border: `3px solid ${INK}`,
        padding: 10, marginBottom: 12,
        boxShadow: 'inset 0 0 0 2px #e8d8a8',
      }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {critters.map(c => <CritterDexCard key={c.name} {...c}/>)}
        </div>
      </div>

      <div style={{
        ...PIXEL_FONT, fontSize: 8, color: '#b8a8d8', textAlign: 'center',
      }}>
        ◂ PG 1/3 ▸ &nbsp;&nbsp; COMPLETE TASKS TO FILL YOUR DEX
      </div>
    </div>
  );
}

/* =========================================================
   VIEW 3 — MAP / OVERWORLD (compact preview)
   ========================================================= */

function MiniMap({ variant = 'A' }) {
  const nodes = [
    { key: 'village', x: 50, y: 50, label: 'VILLAGE',  spr: SPR.house,    elc: null },
    { key: 'beach',   x: 50, y: 14, label: 'BEACH',    spr: SPR.umbrella, elc: '#4ab8d8' },
    { key: 'garden',  x: 22, y: 30, label: 'GARDEN',   spr: SPR.flower,   elc: '#6fb544' },
    { key: 'pond',    x: 78, y: 30, label: 'POND',     spr: SPR.drop,     elc: '#4ab8d8' },
    { key: 'forest',  x: 10, y: 52, label: 'FOREST',   spr: SPR.tree,     elc: '#6fb544' },
    { key: 'tower',   x: 90, y: 52, label: 'TOWER',    spr: SPR.tower,    elc: '#f4c430' },
    { key: 'fire',    x: 22, y: 72, label: 'CAMPFIRE', spr: SPR.campfire, elc: '#e54b4b' },
    { key: 'meadow',  x: 78, y: 72, label: 'MEADOW',   spr: SPR.rainbow,  elc: '#b572d9' },
    { key: 'volcano', x: 50, y: 88, label: 'VOLCANO',  spr: SPR.volcano,  elc: '#e54b4b' },
  ];
  const conns = [
    ['village','beach'],['village','garden'],['village','pond'],
    ['village','forest'],['village','tower'],['village','fire'],
    ['village','meadow'],['village','volcano'],
    ['garden','beach'],['beach','pond'],
    ['garden','forest'],['pond','tower'],
    ['forest','fire'],['tower','meadow'],
    ['fire','volcano'],['meadow','volcano'],
  ];
  const byKey = Object.fromEntries(nodes.map(n => [n.key, n]));

  const isB = variant === 'B';
  const grassBase = isB ? '#d8b070' : '#8fc74a';
  const grassAlt  = isB ? '#c89858' : '#6ba832';
  const bgFrame   = isB ? '#2a1820' : '#1a1420';

  return (
    <div style={{
      padding: 14,
      background: bgFrame,
      border: `4px solid ${INK}`,
      boxShadow: `inset 0 0 0 3px ${isB ? '#c83820' : '#2d5020'}, 3px 3px 0 0 #000`,
      width: 440, height: 440, position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 14,
        background: `repeating-linear-gradient(0deg, ${grassBase} 0 8px, ${grassAlt} 8px 16px),
                     repeating-linear-gradient(90deg, rgba(0,0,0,.04) 0 8px, transparent 8px 16px)`,
        border: `3px solid ${isB ? '#8b5a2b' : '#2d5020'}`,
        imageRendering: 'pixelated', overflow: 'hidden',
      }}>
        {/* Water at top */}
        <div style={{
          position: 'absolute', left: '30%', top: '2%', width: '40%', height: '14%',
          background: 'repeating-linear-gradient(0deg, #8fe0f0 0 4px, #4ab8d8 4px 8px)',
          border: `3px solid #2870a8`,
        }}/>
        {/* Sand */}
        <div style={{
          position: 'absolute', left: '22%', top: '1%', width: '56%', height: '22%',
          background: 'repeating-linear-gradient(45deg, #f8e4b0 0 4px, #d8b870 4px 8px)',
          border: `3px solid #a88844`, zIndex: 0,
        }}/>

        {/* Paths */}
        {conns.map(([a, b], i) => {
          const A = byKey[a], B = byKey[b];
          const dx = B.x - A.x, dy = B.y - A.y;
          const len = Math.sqrt(dx*dx + dy*dy);
          const ang = Math.atan2(dy, dx) * 180 / Math.PI;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${A.x}%`, top: `${A.y}%`,
              width: `${len}%`, height: 10,
              background: 'repeating-linear-gradient(to right, #d8b868 0 6px, #a88844 6px 10px)',
              borderTop: '2px solid #a88844', borderBottom: '2px solid #a88844',
              transform: `translateY(-50%) rotate(${ang}deg)`, transformOrigin: '0 50%',
              zIndex: 1,
            }}/>
          );
        })}

        {/* Trees */}
        {[[5,18],[12,24],[5,62],[15,92],[92,12],[88,28],[94,62],[92,92],[38,96],[60,96]]
          .map(([x,y], i) => (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%,-50%)', zIndex: 2,
            }}>
              <PixelSprite {...SPR.tree} scale={1.4}/>
            </div>
          ))}

        {/* Wandering NPCs */}
        <div style={{ position: 'absolute', left: '40%', top: '60%', zIndex: 3, transform: 'translate(-50%,-50%)' }}>
          <PixelSprite {...SPR.npcKid} scale={1.6}/>
        </div>
        <div style={{ position: 'absolute', left: '62%', top: '62%', zIndex: 3, transform: 'translate(-50%,-50%)' }}>
          <PixelSprite {...SPR.npcCap} scale={1.6}/>
        </div>
        <div style={{ position: 'absolute', left: '68%', top: '80%', zIndex: 3, transform: 'translate(-50%,-50%)' }}>
          <PixelSprite {...SPR.bunny} scale={1.4}/>
        </div>
        <div style={{ position: 'absolute', left: '40%', top: '8%', zIndex: 3, transform: 'translate(-50%,-50%)' }}>
          <PixelSprite {...SPR.fish} scale={1.3}/>
        </div>
        <div style={{ position: 'absolute', left: '30%', top: '42%', zIndex: 3, transform: 'translate(-50%,-50%)' }}>
          <PixelSprite {...SPR.butterfly} scale={1.4}/>
        </div>

        {/* Nodes */}
        {nodes.map(n => (
          <div key={n.key} style={{
            position: 'absolute', left: `${n.x}%`, top: `${n.y}%`,
            transform: 'translate(-50%,-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            zIndex: 4,
          }}>
            <div style={{
              width: 44, height: 40, background: n.elc ? n.elc + '22' : UI_BG,
              border: `3px solid ${INK}`,
              boxShadow: `2px 2px 0 0 rgba(0,0,0,.4)`,
              display: 'grid', placeItems: 'center',
            }}>
              <PixelSprite {...n.spr} scale={1.8}/>
            </div>
            <div style={{
              ...PIXEL_FONT, fontSize: 6, color: '#fff', marginTop: 2,
              textShadow: `1px 1px 0 ${INK}, -1px 1px 0 ${INK}, 1px -1px 0 ${INK}, -1px -1px 0 ${INK}`
            }}>{n.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapViewA() {
  return (
    <div style={{ padding: 16, background: PAPER, width: 520, minHeight: 720, ...BODY_FONT,
                  backgroundImage: 'repeating-linear-gradient(0deg,transparent 0 19px,rgba(0,0,0,.04) 19px 20px)'}}>
      <GameHeader mp={5}/>
      <StatsRow />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <MiniMap variant="A"/>
      </div>
      <Panel style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <PixelSprite {...SPR.house} scale={2}/>
          <div>
            <div style={{ ...PIXEL_FONT, fontSize: 11, color: INK }}>VILLAGE</div>
            <div style={{ ...BODY_FONT, fontSize: 14, color: '#3d2b3f' }}>▸ your base</div>
          </div>
        </div>
        <PixelButton bg="#c8e890" full>♣ REST &nbsp;+3 MP</PixelButton>
      </Panel>
    </div>
  );
}

function MapViewB() {
  // Autumn palette variation
  return (
    <div style={{ padding: 16, background: '#2a1830', width: 520, minHeight: 720, ...BODY_FONT }}>
      <div style={{
        background: '#4a2050', border: `3px solid #f4c430`,
        boxShadow: '3px 3px 0 0 #000', padding: 10, marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <PixelSprite {...SPR.house} scale={2}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...PIXEL_FONT, fontSize: 12, color: '#f4c430' }}>ENGLISH QUEST</div>
          <div style={{ ...BODY_FONT, fontSize: 14, color: '#fce078' }}>▸ DUSK · AUTUMN</div>
        </div>
        <Chip color="#f4c430" bg="#2a1020" style={{ color: '#fce078' }}>
          <PixelSprite {...SPR.foot} scale={1.4}/><span>5</span>
        </Chip>
      </div>

      <StatsRow />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <MiniMap variant="B"/>
      </div>

      <div style={{
        background: '#1a0a1c', border: `3px solid #f4c430`,
        padding: 12, color: '#fce078',
        ...PIXEL_FONT, fontSize: 9, lineHeight: 1.7,
        boxShadow: '3px 3px 0 0 #000',
      }}>
        ▸ TAP A LOCATION TO QUEST<br/>
        ▸ REST AT VILLAGE TO HEAL<br/>
        ▸ FILL YOUR DEX WITH CRITTERS
      </div>
    </div>
  );
}

window.CritterViews = {
  TaskViewA, TaskViewB,
  CollectionViewA, CollectionViewB,
  MapViewA, MapViewB,
};
