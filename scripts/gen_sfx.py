"""Generate royalty-free sound effects procedurally (no external assets).

Outputs 44.1kHz 16-bit WAVs into public/sfx/.
Run: python3 scripts/gen_sfx.py
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=0.1, curve=3.0):
    x = np.ones(n)
    na, nr = int(SR * a), int(SR * r)
    if na:
        x[:na] = np.linspace(0, 1, na)
    if nr:
        x[-nr:] *= np.linspace(1, 0, nr) ** curve
    return x


def onepole_lp(x, cutoff):
    """Time-varying one-pole lowpass; cutoff may be an array."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        a = 1 - np.exp(-2 * np.pi * cutoff[i] / SR)
        acc += a * (x[i] - acc)
        y[i] = acc
    return y


def bandpass(x, f):
    return onepole_lp(x, f * 1.6) - onepole_lp(x, f * 0.6)


def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], axis=1)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print("wrote", name, f"{len(x)/SR:.2f}s")


def whoosh(d=0.9, f0=300, f1=4000):
    n = int(SR * d)
    p = np.linspace(0, 1, n)
    # rise then fall, peak at 60%
    shape = np.where(p < 0.6, (p / 0.6) ** 2, ((1 - p) / 0.4) ** 1.5)
    cutoff = f0 + (f1 - f0) * shape
    noise = rng.standard_normal(n)
    return bandpass(noise, cutoff) * shape


def pop(d=0.18, f0=900, f1=260):
    x = t(d)
    f = f1 + (f0 - f1) * np.exp(-x * 40)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-x * 28)


def ding(d=1.2, f=1318.5):
    x = t(d)
    s = (np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * f * 2.01 * x)
         + 0.25 * np.sin(2 * np.pi * f * 3.02 * x))
    return s * np.exp(-x * 4.5) * env(len(x), 0.002, 0.05)


def bass_hit(d=0.8):
    x = t(d)
    f = 45 + 110 * np.exp(-x * 18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = rng.standard_normal(len(x)) * np.exp(-x * 120) * 0.3
    return (np.sin(ph) * np.exp(-x * 5) + click) * env(len(x), 0.001, 0.1)


def sparkle(d=1.0):
    out = np.zeros(int(SR * d))
    for k in range(9):
        st = int(SR * (0.06 * k + rng.uniform(0, 0.03)))
        tone = ding(0.5, rng.choice([2093, 2349, 2637, 3136, 3520]))
        e = min(len(out), st + len(tone))
        out[st:e] += tone[: e - st] * (0.9 ** k)
    return out


def engine_rev(d=1.6):
    x = t(d)
    p = x / d
    rpm = 28 + 55 * np.sin(np.pi * np.clip(p * 1.3, 0, 1)) ** 2
    ph = 2 * np.pi * np.cumsum(rpm) / SR
    s = np.sign(np.sin(ph)) * 0.6 + np.sin(2 * ph) * 0.4
    s = onepole_lp(s + rng.standard_normal(len(x)) * 0.15, 900)
    return s * env(len(x), 0.08, 0.5, 2)


def click(d=0.05):
    x = t(d)
    return (rng.standard_normal(len(x)) * 0.5 + np.sin(2 * np.pi * 3000 * x)) * np.exp(-x * 200)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    save("whoosh.wav", whoosh())
    save("whoosh-short.wav", whoosh(0.45, 500, 6000))
    save("pop.wav", pop())
    save("ding.wav", ding(), 0.6)
    save("bass-hit.wav", bass_hit())
    save("sparkle.wav", sparkle(), 0.6)
    save("engine-rev.wav", engine_rev())
    save("click.wav", click(), 0.5)
