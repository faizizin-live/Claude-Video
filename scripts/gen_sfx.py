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


def riser(d=1.7):
    """Rising synth + noise sweep that peaks at the end (transform charge-up)."""
    x = t(d)
    p = x / d
    f = 180 * (2 ** (p * 3.2))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.25 * np.sin(1.5 * ph)
    noise = bandpass(rng.standard_normal(len(x)), 400 + 6000 * p ** 2)
    trem = 0.75 + 0.25 * np.sin(2 * np.pi * (6 + 20 * p) * x)
    return (tone * 0.6 + noise * 1.4) * trem * p ** 1.8 * env(len(x), 0.01, 0.03)


def zap(d=0.9):
    """Crackling electric sparks."""
    x = t(d)
    out = np.zeros(len(x))
    for _ in range(26):
        st = int(rng.uniform(0, d - 0.06) * SR)
        n = int(rng.uniform(0.01, 0.05) * SR)
        f = rng.uniform(900, 3500)
        burst = np.sign(np.sin(2 * np.pi * f * np.arange(n) / SR)) * rng.standard_normal(n) * np.exp(-np.arange(n) / n * 4)
        out[st:st + n] += burst * rng.uniform(0.3, 1)
    return out * env(len(x), 0.01, 0.2)


def splash(d=1.4):
    """Big water splash: noisy burst + bubbly tail."""
    x = t(d)
    n = rng.standard_normal(len(x))
    body = onepole_lp(n, 2500 * np.exp(-x * 2.5) + 300) * np.exp(-x * 4)
    hiss = (n - onepole_lp(n, 3000)) * np.exp(-x * 6) * 0.6
    bubbles = np.zeros(len(x))
    for _ in range(40):
        st = int(rng.uniform(0.05, d - 0.1) * SR)
        bt = np.arange(int(0.04 * SR)) / SR
        f0 = rng.uniform(400, 1400)
        b = np.sin(2 * np.pi * (f0 + 3000 * bt) * bt) * np.exp(-bt * 90)
        bubbles[st:st + len(b)] += b * 0.25 * np.exp(-st / SR * 2)
    thump = np.sin(2 * np.pi * (60 + 80 * np.exp(-x * 20)) * x) * np.exp(-x * 9) * 0.8
    return (body * 1.6 + hiss + bubbles + thump) * env(len(x), 0.002, 0.3)


def boat_engine(d=5.0):
    """Outboard engine: idle, throttle up, then fades into the distance."""
    x = t(d)
    p = x / d
    # rpm curve: idle (0-1.3s) -> rev (1.3-2.2s) -> high + slight doppler drop
    idle = 38 + 3 * np.sin(2 * np.pi * 1.5 * x)
    rev = np.interp(x, [0, 1.3, 2.2, 3.0, d], [0, 0, 105, 112, 92])
    f = idle + rev
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    s = saw * 0.7 + np.sign(np.sin(2 * ph)) * 0.25 + np.sin(4 * ph) * 0.2
    s = onepole_lp(s, 600 + 9 * f)
    water = bandpass(rng.standard_normal(len(x)), 900) * np.interp(x, [0, 1.3, 2.2, d], [0.15, 0.2, 0.9, 0.4])
    vol = np.interp(x, [0, 0.2, 1.3, 2.2, 3.2, d], [0, 0.55, 0.55, 1.0, 0.8, 0.0])
    return (s + water) * vol


def sea_ambience(d=6.0):
    """Gentle lapping water."""
    x = t(d)
    n = rng.standard_normal(len(x))
    swell = 0.55 + 0.45 * np.sin(2 * np.pi * 0.45 * x) ** 2
    lap = onepole_lp(n, 700) * swell + (n - onepole_lp(n, 4000)) * 0.08 * swell
    return lap * env(len(x), 0.5, 1.0, 1.5)


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
    save("riser.wav", riser(), 0.8)
    save("zap.wav", zap(), 0.6)
    save("splash.wav", splash(), 0.95)
    save("boat-engine.wav", boat_engine(), 0.9)
    save("sea-ambience.wav", sea_ambience(), 0.6)
