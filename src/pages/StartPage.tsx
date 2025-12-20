import React from "react";
import { Button, Input, Card, StyledOnlyFries } from "../components/ui";
import { useStartPageLogic } from "../hooks";

export const StartPage = (userId: any) => {
    const {
        sessionCode,
        setSessionCode,
        iban,
        setIban,
        ibanError,
        isCreatingSession,
        isJoiningSession,
        handleCreateSession,
        handleJoinSession,
    } = useStartPageLogic(userId);

    return (
        <div className="bg-cream-300 min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
            <div className="w-full max-w-5xl space-y-10">
                {/* Closed friterie troll section (HAHA) */}
                <div>
                    <div className="text-center flex flex-row mt-10 mb-10">
                        <p
                            className="text-5xl font-bold text-yellow-400 animate-glitch"
                            style={{
                                fontFamily: 'Courier New, monospace',
                                textShadow: '2px 2px 0 #000'
                            }}
                        >
                            Bah alors ?? La friterie est fermée ???
                        </p>
                        <img src="/HAH-3x.png" className="animate-laugh ml-10" />
                    </div>
                    <div className="mb-20">
                        <img src="/fryday.jpg" className="mb-10" />
                        <p className="text-4xl font-bold">Passez quand-même de bonnes fêtes, les{' '}
                            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-400 to-gray-900 bg-[length:200%_auto] animate-shine">
                                loosers
                            </span>
                            {' '}du lundi ❤️ </p>

                    </div>
                </div>

                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-neutral-800 mb-4">
                        Bienvenue sur <StyledOnlyFries size="lg" /> ! 🍟
                    </h1>
                    <p className="text-lg text-neutral-600">
                        Créez ou rejoignez une session pour commander ensemble
                    </p>
                </div>

                {/* Cards Container */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {/* Create Session Card */}
                    <Card
                        variant="elevated"
                        padding="xl"
                        rounded="lg"
                        className="flex-1 bg-gradient-to-br from-white to-cream-100"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-800 mb-3">Créer une session</h2>
                            <p className="text-neutral-600">Démarrez une nouvelle session de commande</p>
                        </div>

                        <div className="space-y-6">
                            <Input
                                label="IBAN"
                                placeholder="Votre IBAN belge (BE) ou français (FR)"
                                value={iban}
                                onChange={(e) => setIban(e.target.value)}
                                inputSize="lg"
                                error={ibanError}
                            />

                            <Button
                                onClick={handleCreateSession}
                                loading={isCreatingSession}
                                size="xl"
                                className="w-full"
                                variant="primary"
                                disabled={!!ibanError || !iban.trim()}
                            >
                                {isCreatingSession ? "Création en cours..." : "Créer la session"}
                            </Button>
                        </div>
                    </Card>

                    {/* Divider */}
                    <div className="flex items-center justify-center lg:flex-col">
                        <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-transparent via-secondary-300 to-transparent" />
                        <div className="lg:hidden w-32 border-t border-gradient-to-r from-transparent via-secondary-300 to-transparent" />
                        <div className="px-6 py-3 bg-secondary-500 text-white text-sm font-bold rounded-full shadow-soft">
                            OU
                        </div>
                        <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-transparent via-secondary-300 to-transparent" />
                        <div className="lg:hidden w-32 border-t border-gradient-to-r from-transparent via-secondary-300 to-transparent" />
                    </div>

                    {/* Join Session Card */}
                    <Card
                        variant="elevated"
                        padding="xl"
                        rounded="lg"
                        className="flex-1 bg-gradient-to-br from-white to-cream-100"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-800 mb-3">Rejoindre une session</h2>
                            <p className="text-neutral-600">Entrez le code pour participer</p>
                        </div>

                        <div className="space-y-6">
                            <Input
                                label="Code de session"
                                placeholder="Entrez le code partagé"
                                value={sessionCode}
                                onChange={(e) => setSessionCode(e.target.value)}
                                inputSize="lg"
                            />

                            <Button
                                onClick={handleJoinSession}
                                loading={isJoiningSession}
                                size="xl"
                                className="w-full"
                                variant="secondary"
                            >
                                {isJoiningSession ? "Connexion en cours..." : "Rejoindre la session"}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    );
}; 
