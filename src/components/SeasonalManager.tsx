import { useEffect, useState } from 'react'
import Snowfall from 'react-snowfall'
import { Copy, Save, X } from 'lucide-react'
import { SeasonalConfig, seasonalEvents } from '../data/seasonal'
import { WaifuCorner } from './WaifuCorner'

interface SeasonalManagerProps {
    initialConfig: SeasonalConfig | null
}

import { useTheme } from './ThemeProvider'

export function SeasonalManager({ initialConfig }: SeasonalManagerProps) {
    const { theme } = useTheme()
    const [isClient, setIsClient] = useState(false)
    const [isEnabled, setIsEnabled] = useState(!!initialConfig)
    // Default to the first event if none active, just for editing purposes
    const [config, setConfig] = useState<SeasonalConfig>(initialConfig || seasonalEvents[0])
    const [isAdminOpen, setIsAdminOpen] = useState(false)

    // Advanced state for editing
    const [scale, setScale] = useState(1)
    const [offsetX, setOffsetX] = useState(0)
    const [offsetY, setOffsetY] = useState(0)

    // Deferred loading
    useEffect(() => {
        const timer = setTimeout(() => setIsClient(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    // Listen for the secret trigger: Sequence "itsukii"
    useEffect(() => {
        const sequence = 'itsukii'
        let buffer = ''

        const handleKeyDown = (e: KeyboardEvent) => {
            buffer += e.key
            // Keep buffer same length as sequence
            if (buffer.length > sequence.length) {
                buffer = buffer.slice(-sequence.length)
            }

            if (buffer === sequence) {
                setIsAdminOpen(true)
                buffer = ''
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Update config style when advanced controls change
    useEffect(() => {
        if (!isAdminOpen) return

        setConfig(prev => ({
            ...prev,
            waifu: {
                ...prev.waifu,
                styles: {
                    ...prev.waifu.styles,
                    transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`
                }
            }
        }))
    }, [scale, offsetX, offsetY, isAdminOpen])

    if (!isClient) return null

    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-100" style={{ zIndex: 100 }}>
                {isEnabled && config.snow.enabled && (
                    <Snowfall
                        color={theme === 'dark' ? '#ffffff' : '#aeb9cd'}
                        snowflakeCount={config.snow.intensity}
                        style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: 1 }}
                    />
                )}

                {isEnabled && config.waifu.enabled && (
                    <WaifuCorner
                        url={config.waifu.url}
                        position={config.waifu.position as any}
                        styles={config.waifu.styles}
                    />
                )}
            </div>

            {/* Admin Panel */}
            {isAdminOpen && (
                <AdminPanel
                    config={config}
                    setConfig={setConfig}
                    isEnabled={isEnabled}
                    setIsEnabled={setIsEnabled}
                    onClose={() => setIsAdminOpen(false)}
                    scale={scale} setScale={setScale}
                    offsetX={offsetX} setOffsetX={setOffsetX}
                    offsetY={offsetY} setOffsetY={setOffsetY}
                />
            )}
        </>
    )
}

function AdminPanel({
    config,
    setConfig,
    isEnabled,
    setIsEnabled,
    onClose,
    scale, setScale,
    offsetX, setOffsetX,
    offsetY, setOffsetY
}: {
    config: SeasonalConfig
    setConfig: (c: SeasonalConfig) => void
    isEnabled: boolean
    setIsEnabled: (v: boolean) => void
    onClose: () => void
    scale: number; setScale: (v: number) => void
    offsetX: number; setOffsetX: (v: number) => void
    offsetY: number; setOffsetY: (v: number) => void
}) {
    const [copySuccess, setCopySuccess] = useState(false)

    const handleCopy = () => {
        const json = JSON.stringify(config, null, 2)
        navigator.clipboard.writeText(json)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl space-y-6 bg-white/10 text-(--text-primary)">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Seasonal Effects Admin</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/5">
                        <span className="font-medium">Enable Effects</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={(e) => setIsEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-(--accent) transition-colors"></div>
                        </label>
                    </div>

                    <div className="h-px bg-(--border)" />

                    {/* Waifu Config */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">Waifu Settings</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Scale ({scale})</label>
                                <input type="range" min="0.5" max="2" step="0.1" value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                {/* Placeholder logic for future expansion */}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Offset X ({offsetX}px)</label>
                                <input type="range" min="-300" max="300" value={offsetX} onChange={e => setOffsetX(parseInt(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Offset Y ({offsetY}px)</label>
                                <input type="range" min="-300" max="300" value={offsetY} onChange={e => setOffsetY(parseInt(e.target.value))} className="w-full" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm block mb-1">Image URL</label>
                            <input
                                type="text"
                                value={config.waifu.url}
                                onChange={(e) =>
                                    setConfig({
                                        ...config,
                                        waifu: { ...config.waifu, url: e.target.value },
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-black/5 border border-(--border) focus:outline-none focus:border-(--accent)"
                            />
                        </div>
                        <div>
                            <label className="text-sm block mb-1">Position</label>
                            <select
                                value={config.waifu.position}
                                onChange={(e) =>
                                    setConfig({
                                        ...config,
                                        waifu: {
                                            ...config.waifu,
                                            position: e.target.value as any,
                                        },
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-black/5 border border-(--border) focus:outline-none focus:border-(--accent)"
                            >
                                <option value="bottom-right">Bottom Right</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="top-right">Top Right</option>
                                <option value="top-left">Top Left</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-(--accent) text-white font-medium hover:brightness-110 transition-all active:scale-95"
                >
                    {copySuccess ? (
                        <>
                            <Save className="w-5 h-5" /> Copied JSON!
                        </>
                    ) : (
                        <>
                            <Copy className="w-5 h-5" /> Copy Config JSON
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
