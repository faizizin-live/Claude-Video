import sys, json
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[2], device="cpu", compute_type="int8")
_a = __import__("numpy").fromfile(sys.argv[1],dtype="float32"); segs, info = m.transcribe(_a, word_timestamps=True, vad_filter=False, condition_on_previous_text=False, language=(sys.argv[3] or None))
print(info.language, info.language_probability, file=sys.stderr)
out=[]
for s in segs:
    print(f"[{s.start:.2f}-{s.end:.2f}] {s.text}", file=sys.stderr)
    out.append({"start":s.start,"end":s.end,"text":s.text.strip(),"words":[{"w":w.word.strip(),"s":w.start,"e":w.end,"p":w.probability} for w in s.words]})
json.dump(out, open(sys.argv[4] if len(sys.argv)>4 else "tr.json","w"), ensure_ascii=False, indent=1)
